// tools/testSendFirstWarning.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { sendFirstWarning } = require('../lib/photoChecker/sendFirstWarning')
const path = require('path')

async function startBot() {
  const authFolder = path.resolve(__dirname, '../auth') // pasta para salvar sessão
  const { state, saveCreds } = await useMultiFileAuthState(authFolder)

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('⛔ Conexão fechada. Reconectar?', shouldReconnect)
      if (shouldReconnect) startBot()
    }

    if (connection === 'open') {
      console.log('✅ Conectado! Enviando avisos de teste...\n')
      await sendFirstWarning('5511975426306@s.whatsapp.net', sock)
      await sendFirstWarning('5511989449972@s.whatsapp.net', sock)
      console.log('\n✅ Avisos enviados com sucesso!')
      process.exit(0)
    }
  })
}

startBot()
