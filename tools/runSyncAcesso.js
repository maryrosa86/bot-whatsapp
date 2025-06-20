const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { syncGroupWithSheets } = require('./syncGroupWithSheetsAcesso')

async function iniciar() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })
  sock.ev.on('creds.update', saveCreds)

  // Aguarda a conexão com o WhatsApp estar pronta
  await new Promise(resolve => {
    sock.ev.on('connection.update', ({ connection }) => {
      if (connection === 'open') {
        console.log('✅ Conectado ao WhatsApp')
        resolve()
      }
    })
  })

  // Só roda a sincronização depois de conectar
  await syncGroupWithSheets(sock)
}

iniciar()
