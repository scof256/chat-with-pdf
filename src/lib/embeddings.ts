import { VoyageAIClient } from "voyageai";

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function getEmbeddings(text: string) {
  try {
    const result = await voyage.embed({
      texts: [text.replace(/\n/g, " ")],
      model: process.env.EMBEDDING_MODEL || "voyage-large-2-instruct",
    });
    console.log("getEmb result-=>", result);
    return result?.embeddings[0] as number[];
  } catch (error) {
    console.log("error calling voyage embeddings ai", error);
    throw error;
  }
}
