const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const { default: P } = require('pino')
const { handleUserExit } = require('../lib/feedback/handleUserExit')
const { sendFeedbackButtons } = require('../lib/feedback/sendFeedbackButtons')

async function runTest() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' })
  })

  // Mostrar todos os updates de conexão no terminal
  sock.ev.on('connection.update', async (update) => {
    console.log('🔄 Atualização de conexão:', update)

    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      console.log('🟢 Bot conectado com sucesso.')
      // ENVIA MENSAGEM DE TESTE PARA O SEU NÚMERO
      await sendFeedbackButtons(sock, '5511959344515')
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) runTest()
      else console.log('❌ Sessão encerrada. Escaneie o QR Code novamente.')
    }
  })

  // Captura respostas (botão ou número) e feedback adicional
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg?.message || msg.key.fromMe) return
    await handleUserExit(sock, msg)
  })

  // Salva os dados de login
  sock.ev.on('creds.update', saveCreds)
}

runTest()
