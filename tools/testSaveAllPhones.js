// testSaveAllPhones.js

const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { saveAllPhonesToIndividualSheet } = require('../lib/sheets/saveAllPhonesToIndividualSheet')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr } = update
    if (qr) {
      require('qrcode-terminal').generate(qr, { small: true })
    }
    if (connection === 'open') {
      console.log('🤖 Conectado. Iniciando gravação dos telefones na planilha...')
      await saveAllPhonesToIndividualSheet(sock)
      console.log('✅ Processo finalizado.')
    }
  })
}

startBot()