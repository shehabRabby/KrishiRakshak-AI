import { NextRequest, NextResponse } from "next/server";
import * as ort from "onnxruntime-node";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import guidelines from "@/data/bari_guidelines.json";

const DiagnosisResponseSchema = z.object({
  crop_name_en: z.string(),
  crop_name_bn: z.string(),
  disease_name_en: z.string(),
  disease_name_bn: z.string(),
  severity: z.enum(["Low", "Moderate", "High", "Healthy"]),
  symptoms_en: z.string(),
  symptoms_bn: z.string(),
  organic_remedy_en: z.array(z.string()),
  organic_remedy_bn: z.array(z.string()),
  chemical_remedy_en: z.string(),
  chemical_remedy_bn: z.string(),
  preventive_tips_en: z.array(z.string()),
  preventive_tips_bn: z.array(z.string()),
  guideline_citation: z.string(),
});

function softmax(logits: Float32Array): number[] {
  const maxLogit = Math.max(...Array.from(logits));
  const exps = Array.from(logits).map((x) => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sumExps);
}

function retrieveGuideline(predictedLabel: string) {
  const lower = predictedLabel.toLowerCase();
  for (const item of guidelines) {
    if (item.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return item;
    }
  }
  return guidelines[guidelines.length - 1];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // 1. Image Preprocessing (Matches PyTorch ImageNet normalization)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, info } = await sharp(buffer)
      .resize(224, 224, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const floatData = new Float32Array(3 * 224 * 224);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < 224 * 224; i++) {
      const r = data[i * info.channels] / 255.0;
      const g = data[i * info.channels + 1] / 255.0;
      const b = data[i * info.channels + 2] / 255.0;

      floatData[i] = (r - mean[0]) / std[0]; // R channel
      floatData[224 * 224 + i] = (g - mean[1]) / std[1]; // G channel
      floatData[2 * 224 * 224 + i] = (b - mean[2]) / std[2]; // B channel
    }

    // 2. ONNX ML Inference
    const modelPath = path.join(
      process.cwd(),
      "public",
      "models",
      "crop_disease_model.onnx",
    );
    const labelsPath = path.join(
      process.cwd(),
      "public",
      "models",
      "labels.json",
    );
    const labelsMap: Record<string, string> = JSON.parse(
      fs.readFileSync(labelsPath, "utf-8"),
    );

    const session = await ort.InferenceSession.create(modelPath);
    const inputTensor = new ort.Tensor("float32", floatData, [1, 3, 224, 224]);
    const results = await session.run({ input: inputTensor });
    const logits = results.output.data as Float32Array;

    const probs = softmax(logits);
    const top3 = probs
      .map((prob, idx) => ({
        label: labelsMap[String(idx)] || `Class_${idx}`,
        confidence: Number((prob * 100).toFixed(2)),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    const topPrediction = top3[0];

    // 3. RAG Retrieval + Gemini Bilingual Synthesis
    const ragContext = retrieveGuideline(topPrediction.label);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are an expert Bangladeshi Agronomist and Plant Pathologist.
ML Model Top Prediction: "${topPrediction.label}" (Confidence: ${topPrediction.confidence}%)
Verified BARI/DAE RAG Context: ${JSON.stringify(ragContext)}

Generate a structured JSON response strictly matching this schema:
{
  "crop_name_en": "string",
  "crop_name_bn": "string (in Bangla)",
  "disease_name_en": "string",
  "disease_name_bn": "string (in Bangla)",
  "severity": "Low | Moderate | High | Healthy",
  "symptoms_en": "string",
  "symptoms_bn": "string (natural farmer-friendly Bangla)",
  "organic_remedy_en": ["step 1", "step 2"],
  "organic_remedy_bn": ["ধাপ ১", "ধাপ ২"],
  "chemical_remedy_en": "string (strictly within safe BARI dosage)",
  "chemical_remedy_bn": "string (safe dosage in Bangla)",
  "preventive_tips_en": ["tip 1", "tip 2"],
  "preventive_tips_bn": ["পরামর্শ ১", "পরামর্শ ২"],
  "guideline_citation": "${ragContext.guideline_source}"
}
`;

    const aiResult = await model.generateContent(prompt);
    const rawJson = JSON.parse(aiResult.response.text());
    const validatedAdvisory = DiagnosisResponseSchema.parse(rawJson);

    return NextResponse.json({
      predictions: top3,
      low_confidence_warning: topPrediction.confidence < 70,
      advisory: validatedAdvisory,
    });
  } catch (error: unknown) {
    console.error("Diagnosis API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process leaf image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
