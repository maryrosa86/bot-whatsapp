const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const path = require('path');
const { hasProfilePicture } = require('../lib/photoChecker/hasProfilePicture');
const qrcode = require('qrcode-terminal');

const authFolder = path.resolve(__dirname, '../auth'); // certifique-se que o caminho seja o mesmo usado no index.js

const numbersToTest = [
  '5511934840605',

];

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado. Verificando fotos...');
      await runTest(sock);
      process.exit(0);
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.message || 'desconhecida';
      console.error(`❌ Conexão encerrada: ${reason}`);
      process.exit(1);
    }
  });
}

async function runTest(sock) {
  for (const number of numbersToTest) {
    const jid = number + '@s.whatsapp.net';
    try {
      const result = await hasProfilePicture(jid, sock);
      console.log(`📸 ${number}: ${result ? 'TEM FOTO' : 'NÃO TEM FOTO'}`);
    } catch (err) {
      console.error(`❌ Erro ao verificar ${number}:`, err.message || err);
    }
  }
}

start();
