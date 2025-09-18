import { VoyageAIClient } from "voyageai";

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function getEmbeddings(text: string) {
  try {
    const result = await voyage.embed({
      input: [text.replace(/\n/g, " ")],
      model: process.env.EMBEDDING_MODEL || "voyage-large-2-instruct",
    });
    console.log("getEmb result-=>", result);
    if (!result.data || !result.data[0]) {
      throw new Error("voyage embeddings failed");
    }
    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling voyage embeddings ai", error);
    throw error;
  }
}
