import express from "express";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

const app = express();
app.use(express.json());


const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"]
  }
});

client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("🔥 WhatsApp conectado com sucesso!");
});


client.initialize();


app.post("/send", async (req, res) => {
  const { number, message } = req.body;

  try {
    await client.sendMessage(`${number}@c.us`, message);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ error });
  }
});


app.listen(3001, () => {
  console.log("🚀 Servidor WhatsApp rodando na porta 3001");
});
