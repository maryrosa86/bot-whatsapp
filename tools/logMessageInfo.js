// const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
// const qrcode = require('qrcode-terminal')

// async function startBot() {
//   const { state, saveCreds } = await useMultiFileAuthState('auth')
//   const sock = makeWASocket({ auth: state })

//   sock.ev.on('connection.update', ({ connection, qr }) => {
//     if (qr) qrcode.generate(qr, { small: true })
//     if (connection === 'open') console.log('✅ Bot conectado (log de mensagens)')
//   })

//   sock.ev.on('creds.update', saveCreds)

//   sock.ev.on('messages.upsert', async ({ messages }) => {
//     const msg = messages[0]
//     const remoteJid = msg.key.remoteJid

//     // Mostra apenas mensagens de grupos
//     if (remoteJid.endsWith('@g.us')) {
//       const texto = msg.message?.conversation || msg.message?.extendedTextMessage?.text
//       console.log(`📥 Mensagem recebida em grupo:`)
//       console.log(`🆔 groupId: ${remoteJid}`)
//       console.log(`💬 conteúdo: ${texto}`)
//     }
//   })
// }

// startBot()
