import sayai from "./commands/sayai.js";
import dotenv from "dotenv";
import sticker from "./commands/sticker.js";
import convertmp3 from "./commands/convertmp3.js";
import mp4tiktok from "./commands/mp4tiktok.js";

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
      break;
    case "sticker":
      if (msg.message.imageMessage) {
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
  }
}
