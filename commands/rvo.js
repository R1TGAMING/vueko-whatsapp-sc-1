import { downloadMediaMessage } from "baileys";
import fs from "fs";
import pino from "pino";

export default async function rvo(msg) {
  const quoted = msg.message.extendedTextMessage.contextInfo;
  const quotedMsg = quoted.quotedMessage;

  if (quotedMsg.imageMessage) {
    const buffer = await downloadMediaMessage(
      { message: quotedMsg },
      "buffer",
      {},
      { logger: pino({ level: "silent" }) }
    );

    fs.writeFileSync("./rvo/image.jpg", buffer);
  } else if (quotedMsg.videoMessage) {
    const buffer = await downloadMediaMessage(
      { message: quotedMsg },
      "buffer",
      {},
      { logger: pino({ level: "silent" }) }
    );

    fs.writeFileSync("./rvo/video.mp4", buffer);
  }
}
