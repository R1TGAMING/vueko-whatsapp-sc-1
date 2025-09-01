import makeWASocket, { useMultiFileAuthState } from "baileys";
import chalk from "chalk";
import readline from "readline";
import pino from "pino";
import bot from "./bot.js";

const usePairingCode = true;

const prompt = async (promt) => {
  process.stdout.write(promt);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question("", (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

const connectToWhatsapp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

  console.log(chalk.green("[ INFO ]"), chalk.yellow("Sedang Memulai Bot..."));

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
  });

  if (usePairingCode && !sock.authState.creds?.registered) {
    console.log(chalk.greenBright("Masukan nomer dengan diawali 62"));
    const phoneNumber = await prompt(chalk.gray("> "));
    const code = await sock.requestPairingCode(phoneNumber.trim());
    console.log(chalk.greenBright("Kode Pairing: "), chalk.yellow(code));
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === "close") {
      console.log(chalk.red("[ ERROR ]"), chalk.yellow("Koneksi Terputus..."));
      connectToWhatsapp();
    } else if (connection === "open") {
      console.log(chalk.green("[ INFO ]"), chalk.yellow("Koneksi Berhasil..."));
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];

    if (!msg.message) return;

    bot(sock, m);
  });
};

connectToWhatsapp();
