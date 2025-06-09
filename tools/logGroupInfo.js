const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('connection.update', ({ connection, qr }) => {
    if (qr) qrcode.generate(qr, { small: true })
    if (connection === 'open') console.log('✅ Bot conectado para log de grupos')
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('group-participants.update', ({ id, participants, action }) => {
    if (action === 'add') {
      console.log('🔍 Novo(s) participante(s) no grupo:')
      console.log(`🆔 groupId: ${id}`)
      console.log(`👥 participantes:`, participants)
    }
  })
}

startBot()
