import { downloadMediaMessage } from "baileys";
import pino from "pino";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { Sticker } from "wa-sticker-formatter";

function stickerPngToWebp(buffer, sock, sender) {
  fs.writeFileSync("./sticker/sticker.png", buffer);

  ffmpeg("./sticker/sticker.png")
    .outputOptions("-q:v 75")
    .save("./sticker/sticker.webp")
    .on("end", async () => {
      await new Sticker("./sticker/sticker.webp")
        .setPack("+6285137211219")
        .setAuthor("Vueko Bot")
        .toFile("sticker/sticker.webp");

      console.log(`Conversion of PNG to WebP complete.`);
      await sock.sendMessage(sender, {
        sticker: { url: "sticker/sticker.webp" },
      });
    })
    .on("error", (err) => {
      console.error(`Error during conversion: ${err.message}`);
    });
}

function stickerGifToWebp(buffer, sock, sender) {
  fs.writeFileSync("./sticker/sticker.mp4", buffer);

  ffmpeg("./sticker/sticker.mp4")
    .outputOptions([
      "-vf",
      "scale=512:512:force_original_aspect_ratio=decrease,fps=15",
      "-loop",
      "0",
      "-an",
      "-vsync",
      "0",
      "-s",
      "512x512",
      "-t",
      "8",
    ])
    .save("./sticker/sticker_gif.webp")
    .on("end", async () => {
      await new Sticker("./sticker/sticker_gif.webp")
        .setPack("+6285137211219")
        .setAuthor("Vueko Bot")
        .toFile("sticker/sticker_gif.webp");

      console.log(`Conversion of GIF to WebP complete.`);
      await sock.sendMessage(sender, {
        sticker: { url: "sticker/sticker_gif.webp" },
      });
    })
    .on("error", (err) => {
      console.error(`Error during conversion: ${err.message}`);
    });
}

export default async function sticker(sock, sender, msg) {
  try {
    await sock.sendMessage(sender, {
      text: "Tunggu sejenak memproses sticker... ☕",
    });
    const buffer = await downloadMediaMessage(
      msg,
      "buffer",
      {},
      { logger: pino({ level: "silent" }) }
    );

    if (msg.message.imageMessage) {
      stickerPngToWebp(buffer, sock, sender);
    } else if (msg.message.videoMessage) {
      if (msg.message.videoMessage.gifPlayback) {
        stickerGifToWebp(buffer, sock, sender);
      }
    }
  } catch (error) {
    console.error("Error downloading or processing media:", error);
    await sock.sendMessage(sender, { text: "Failed to process the image." });
  }
}
