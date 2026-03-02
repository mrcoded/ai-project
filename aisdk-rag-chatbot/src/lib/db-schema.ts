import { pgTable, serial, vector, text, index } from "drizzle-orm/pg-core";

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 3072 }),
  },
  (table) => ({
    embeddingIndex: index("embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export type InsertDocument = typeof documents.$inferInsert;
export type selectDocument = typeof documents.$inferSelect;
