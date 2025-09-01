import { downloadMediaMessage } from "baileys";
import pino from "pino";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export default async function sticker(sock, sender, msg) {
  try {
    const buffer = await downloadMediaMessage(
      msg,
      "buffer",
      {},
      { logger: pino({ level: "silent" }) }
    );

    fs.writeFileSync("./sticker/sticker.png", buffer);

    ffmpeg("./sticker/sticker.png")
      .outputOptions("-q:v 75")
      .save("./sticker/sticker.webp")
      .on("end", async () => {
        console.log(`Conversion of PNG to WebP complete.`);
        await sock.sendMessage(sender, {
          sticker: { url: "./sticker/sticker.webp" },
        });
      })
      .on("error", (err) => {
        console.error(`Error during conversion: ${err.message}`);
      });
  } catch (error) {
    console.error("Error downloading or processing media:", error);
    await sock.sendMessage(sender, { text: "Failed to process the image." });
  }
}
