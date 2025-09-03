import sayai from "./commands/sayai.js";
import dotenv from "dotenv";
import sticker from "./commands/sticker.js";
import convertmp3 from "./commands/convertmp3.js";
import mp4tiktok from "./commands/mp4tiktok.js";
import mp4yt from "./commands/mp4yt.js";
import tagall from "./commands/tagall.js";

const helpCaption = `
*Bot Vueko Command List*

📌 _Prefix_: !

*General*
| > !help
-| Untuk melihat list command dan bantuan
| > !ping
-| Untuk mengecek apakah bot aktif
| > !halo
-| Membalas dengan hai
| > !tagall
-| Menandai semua anggota di grup

*Downloader*
| > !mp4tiktok {url}
-| Mendownload video dari TikTok
| > !mp4yt {url}
-| Mendownload video dari YouTube
| > !convertmp3
-| Mengubah format mp4 (video) ke mp3 (audio)

*Fun*
| > !sayai
-| Berbicara kepada AI Gemini
| > !sticker 
-| Mengubah gambar menjadi sticker WhatsApp

📝 Gunakan prefix "!" sebelum command.

👾 Bot ini dibuat oleh ipii
Social Media:
| > GitHub: https://github.com/R1TGAMING
| > Tiktok: https://www.tiktok.com/@ipidev
| > Instagram: https://www.instagram.com/ipigemink/

⊹ ࣪ ﹏𓊝﹏𓂁﹏⊹ ࣪ ˖
`;

export default async function bot(sock, m) {
  const msg = m.messages[0];

  if (!msg.message) return;
  dotenv.config({ path: "./.env" });

  const body =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption ||
    "";

  const sender = msg.key.remoteJid;

  const args = body.slice(1).trim().split(" ");

  if (!body.startsWith("!")) return;

  const command = args.shift().toLowerCase();

  switch (command) {
    case "help":
      await sock.sendMessage(sender, {
        image: { url: "./assets/banner.jpg" },
        caption: helpCaption,
      });
      break;
    case "tagall":
      try {
        await tagall(sock, sender);
        break;
      } catch (error) {
        console.error("Error calling tagall:", error);
        await sock.sendMessage(sender, {
          text: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
        });
        break;
      }
    case "ping":
      await sock.sendMessage(sender, { text: "Pong!" });
      break;
    case "halo":
      await sock.sendMessage(sender, { text: "hai" });
      break;
    case "sayai":
      if (args.length === 0) {
        await sock.sendMessage(sender, {
          text: "Mau bilang apa pada AI?",
        });
        break;
      } else {
        try {
          const response = await sayai(args.join(" "));
          await sock.sendMessage(sender, { text: response.parts[0].text });
          break;
        } catch (error) {
          console.error("Error calling sayai:", error);
          await sock.sendMessage(sender, {
            text: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
          });
          break;
        }
      }
    case "sticker":
      if (msg.message.imageMessage || msg.message.videoMessage) {
        
        await sticker(sock, sender, msg);
        break;
      } else {
        await sock.sendMessage(sender, {
          text: "Kirim gambar dengan caption !sticker untuk membuat stiker.",
        });
        break;
      }
    case "convertmp3":
      if (msg.message.videoMessage) {
        await convertmp3(sock, sender, msg);
        break;
      } else {
        await sock.sendMessage(sender, {
          text: "Kirim video dengan caption !convertmp3 untuk mengubahnya menjadi audio.",
        });
        break;
      }
    case "mp4tiktok":
      if (args.length === 0) {
        await sock.sendMessage(sender, {
          text: "Kirim link TikTok dengan caption !mp4tiktok untuk mengunduh videonya.",
        });
        break;
      } else {
        try {
          await mp4tiktok(sock, sender, args[0]);
          break;
        } catch (error) {
          console.error("Error calling mp4tiktok:", error);
          await sock.sendMessage(sender, {
            text: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
          });
          break;
        }
      }
    case "mp4yt":
      if (args.length === 0) {
        await sock.sendMessage(sender, {
          text: "Kirim link YouTube dengan caption !mp4yt untuk mengunduh videonya.",
        });
        break;
      } else {
        try {
          await mp4yt(sock, sender, args[0]);
          break;
        } catch (error) {
          console.error("Error calling mp4yt:", error);
          await sock.sendMessage(sender, {
            text: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
          });
          break;
        }
      }
  }
}
