import { VoyageAIClient } from "voyageai";

const voyageai = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function getEmbeddings(text: string) {
  try {
    const result = await voyageai.embed({
      texts: [text.replace(/\n/g, " ")],
      model: "voyage-2",
    });
    return result.embeddings[0];
  } catch (error) {
    console.log("error calling voyage ai embeddings", error);
    throw error;
  }
}
