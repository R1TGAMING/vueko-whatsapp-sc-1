import axios from "axios";

const base_url = ["https://pic.re/image"];

export default async function randommnime() {
  const res = await axios.get(base_url[0], { responseType: "arraybuffer" });
  const stream = res.data;

  const buffer = Buffer.from(stream);
  return buffer;
}
