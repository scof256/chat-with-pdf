import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: process.env.OPENAI_EMBEDDING_MODEL_NAME || "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    console.log("getEmb result-=>", result);
    return result?.data[0]?.embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings ai", error);
    throw error;
  }
}
