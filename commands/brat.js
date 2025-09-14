import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const url = ["https://api.ferdev.my.id/maker/brat"]

export default async function brat(sock, sender, args) {
  try {

  const res = await axios.get(url[0] + "?text=" + args + "&apikey=" + process.env.RESITA_API_KEY, {responseType: "arraybuffer"});

  const buffer = Buffer.from(res.data, "binary")

   await sock.sendMessage(sender, {
      image: buffer,
      caption: "Brat Berhasil Dibuat."
   })
  } catch (e) {
    console.error(e);
  }

}
