import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

export async function generateEmbedding(text: string) {
  const input = text.replace("\n", " ");

  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-001"),
    value: input,
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((text) => text.replace("\n", " "));

  const { embeddings } = await embedMany({
    model: google.embeddingModel("gemini-embedding-001"),
    values: inputs,
  });

  return embeddings;
}
