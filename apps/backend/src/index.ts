import { Hono } from "hono";
import { cors } from "hono/cors";

interface Env {
  AI: Ai;
}

interface WhisperResponse {
  text: string;
}

interface TranscribeRequest {
  audio: number[];
}

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "Voco Transcription API" });
});

app.post("/transcribe", async (c) => {
  try {
    const body = await c.req.json<TranscribeRequest>();

    if (!body.audio || body.audio.length === 0) {
      return c.json({ error: "No audio data provided" }, 400);
    }

    const response = (await c.env.AI.run("@cf/openai/whisper", {
      audio: body.audio,
    })) as WhisperResponse;

    console.log("Transcription result:", response);

    return c.json({
      text: response.text,
      byteLength: body.audio.length,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return c.json(
      {
        error: error instanceof Error ? error.message : "Transcription failed",
      },
      500
    );
  }
});

export default app;
