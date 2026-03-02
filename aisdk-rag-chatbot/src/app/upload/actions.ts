"use server";

import { PDFParse } from "pdf-parse";
import { db } from "@/lib/db-config";
import { chunkContent } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { documents } from "@/lib/db-schema";

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. THE FIX: Convert directly to Uint8Array instead of Buffer
    const uint8Array = new Uint8Array(bytes);
    // / 3. Pass the uint8Array to your parser
    const parser = new PDFParse(uint8Array);
    // const parser = new PDFParse(buffer);

    const data = await parser.getText();

    if (!data.text || data.text.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF",
      };
    }

    const chunks = await chunkContent(data.text);
    const embeddings = await generateEmbeddings(chunks);

    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
  } catch (error) {
    console.error("PDF processing error", error);
    return {
      success: false,
      error: "Failed to process PDF",
    };
  }
}
