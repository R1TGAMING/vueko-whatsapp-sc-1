import ytdl from "@distube/ytdl-core";
import fs from "fs";

export default async function mp4yt(sock, sender, args) {
  const writer = fs.createWriteStream("./mp4yt/video.mp4");
  let obj = {};

  await sock.sendMessage(sender, {
    text: "Tunggu sejenak sedang mengunduh video... ☕",
  });

  ytdl(args).pipe(writer);

  ytdl.getBasicInfo(args).then((info) => {
    obj = {
      title: info.videoDetails.title,
      view: info.videoDetails.viewCount,
      upload_date: info.videoDetails.uploadDate,
    };
  });

  writer.on("finish", async () => {
    console.log("Download selesai:", "./mp4yt/video.mp4");
    await sock.sendMessage(sender, {
      video: { url: "./mp4yt/video.mp4" },
      caption: `Berhasil mengunduh video YouTube \n\n*Title:* ${obj.title}\n\n*Total Views:* ${obj.view}\n\n*Upload Date:* ${obj.upload_date}`,
    });
  });
  writer.on("error", (err) => {
    console.error("Error:", err);
  });
}
