import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

let embeddingsClient: VoyageEmbeddings | null = null;

const getEmbeddingsClient = () => {
    if (!embeddingsClient) {
        embeddingsClient = new VoyageEmbeddings({
            modelName: "voyage-3.5-lite",
        });
    }
    return embeddingsClient;
}

export async function getEmbeddings(text: string) {
  try {
    const client = getEmbeddingsClient();
    const res = await client.embedQuery(text.replace(/\n/g, " "));
    return res;
  } catch (error) {
    console.log("error calling voyage ai embeddings", error);
    throw error;
  }
}
