import axios from "axios";
import fs from "fs";

const list_url = ["https://tikwm.com"];

export default async function mp4tiktok(sock, sender, url) {
  try {
    const url_1 = list_url[0] + "/api/?url=" + url;
    console.log("Fetching TikTok video from:", url_1);
    const path = "./mp4tiktok/video.mp4";

    await sock.sendMessage(sender, {
      text: "Tunggu sejenak sedang mengunduh video... ☕",
    });

    const res = await axios.get(url_1);

    const data = res.data;

    const stream_res = await axios.get(data.data.play, {
      responseType: "stream",
    });

    const writer = fs.createWriteStream(path);

    stream_res.data.pipe(writer);

    writer.on("finish", async () => {
      console.log("Download selesai:", path);
      await sock.sendMessage(sender, {
        video: { url: path },
        caption: "Berhasil mengunduh video TikTok",
      });
    });
    writer.on("error", (err) => {
      console.error("Error:", err);
    });
  } catch (error) {
    console.error("Error fetching TikTok video:", error);
    throw new Error("Failed to fetch TikTok video: " + error.message);
  }
}
