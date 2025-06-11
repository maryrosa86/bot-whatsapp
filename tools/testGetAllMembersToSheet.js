// tools/testGetAllMembersToSheet.js

const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { getAllMembersToSheet } = require('../lib/sheets/getAllMembersToSheet')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update
    if (qr) {
      require('qrcode-terminal').generate(qr, { small: true })
    }
    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp')
    }
  })

  sock.ev.on('creds.update', saveCreds)

  // Aguarda conexão antes de rodar
  sock.ev.on('connection.update', async (update) => {
  if (update.connection === 'open') {
    await getAllMembersToSheet(sock)
    console.log('🏁 Finalizado')
    process.exit(0)
  }
})

}

start()
