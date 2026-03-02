import {
  convertToModelMessages,
  InferUITools,
  streamText,
  tool,
  UIMessage,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";
import { searchDocuments } from "@/lib/search";

const tools = {
  searchKnowledgeBae: tool({
    description: "Search the knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, 0.5);

        if (results.length === 0) {
          return "No relevant information found in the knowledge base";
        }

        const formattedResults = results
          .map((result, i) => `[${i + 1}] ${result.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Search error", error);
        return "Error searchng the knowlege base";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(2),
      system: `You are a helpful assistant with access to a knowledge base. When users ask questions, search the knowlege base for relevant information.
        Always search before answering if the question might relate to uploaded documents.
        Base your answers on the search results when available. Give concise answers that are relevant to the user's question.
        Do not flood them with all the information from the search results `,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion", error);
    return Response.json(
      {
        error: "Failed to stream chat completion.",
      },
      { status: 500 },
    );
  }
}
