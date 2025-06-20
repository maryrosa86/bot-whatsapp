const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const { handleGroupJoin } = require('./lib/groupActions/handleGroupJoin')
const { handleUserExit } = require('./lib/groupActions/handleUserExit')


async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })

  // Mostra o QR code no terminal
  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update
    if (qr) {
      require('qrcode-terminal').generate(qr, { small: true })
    }
    if (connection === 'open') {
      console.log('✅ Bot conectado')
    }
  })

  // Salva credenciais
  sock.ev.on('creds.update', saveCreds)

 //Entrada e saída de participantes
// sock.ev.on('group-participants.update', (update) => {
//   handleGroupJoin(sock, update)

  // handleUserExit(sock, update)
// })
sock.ev.on('group-participants.update', (update) => {
  if (update.action === 'add') {
    handleGroupJoin(sock, update)
  } else if (update.action === 'remove') {
    handleUserExit(sock, update)
  }
})

}

startBot()
