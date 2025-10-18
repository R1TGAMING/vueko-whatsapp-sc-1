import axios from "axios";
import { downloadMediaMessage } from "baileys";
import pino from "pino";

export default async function hitamkan(msg, sock, sender) {
  try {
    const buffer = await downloadMediaMessage(
      msg,
      "buffer",
      {},
      { logger: pino({ level: "silent" }) }
    );

    const imageBase64 = buffer.toString("base64");

    await sock.sendMessage(sender, {
      text: "Tunggu sejenak sedang memproses gambar... ☕",
    });

    const { data } = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent",
      {
        contents: [
          {
            parts: [
              { text: "Turn into black skin" },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64,
                },
              },
            ],
          },
        ],
        generation_config: {
          response_modalities: ["TEXT", "IMAGE"],
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GOOGLE_GEMINI_API_KEY,
        },
      }
    );

    const imageData = data.candidates[0].content.parts[1].inlineData.data;

    if (imageData) {
      const buffer = Buffer.from(imageData, "base64");

      await sock.sendMessage(sender, {
        image: buffer,
        caption: "Waifu anda telah dihitamkan",
      });
    } else {
      await sock.sendMessage(sender, {
        text: "❌ Tidak ada gambar dari Gemini",
      });
    }
  } catch (error) {
    console.error("Error calling hitamkan:", error);
    throw new Error("Gagal Membuat Gambar")
  }
}
