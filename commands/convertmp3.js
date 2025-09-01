import { downloadMediaMessage } from "baileys";
import pino from "pino";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

export default async function convertmp3(sock, sender, msg) {
  try {
    const buffer = await downloadMediaMessage(
      msg,
      "buffer",
      {},
      { logger: pino({ level: "silent" }) }
    );

    fs.writeFileSync("./convertmp3/video.mp4", buffer);

    ffmpeg("./convertmp3/video.mp4")
      .noVideo()
      .toFormat("mp3")
      .save("./convertmp3/audio.mp3")
      .on("error", (err) => {
        console.error(`Error during conversion: ${err.message}`);
      })
      .on("end", async () => {
        console.log(`Conversion of video to audio complete.`);
        await sock.sendMessage(sender, {
          audio: { url: "./convertmp3/audio.mp3" },
          mimetype: "audio/mpeg",
        });
      });
  } catch (error) {
    console.error("Error downloading or processing media:", error);
    await sock.sendMessage(sender, {
      text: "Failed to convert video to audio.",
    });
  }
}
