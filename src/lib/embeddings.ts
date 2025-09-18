import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

export const getEmbeddings = async (text: string) => {
  try {
    const embeddings = new VoyageEmbeddings({
      apiKey: process.env.VOYAGE_API_KEY || process.env.VOYAGEAI_API_KEY,
    });
    const result = await embeddings.embedQuery(text.replace(/\n/g, ""));
    return result;
  } catch (error) {
    console.log("error calling voyage embeddings api", error);
    throw error;
  }
};
