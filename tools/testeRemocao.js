const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { checkAndNotify } = require('../lib/photoChecker/checkAndNotify')

async function iniciarTeste() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  })

  sock.ev.on('creds.update', saveCreds)

  const jid = '5511967934937@s.whatsapp.net'
  const tentativa = 3

  console.log(`🚀 Iniciando teste de remoção para ${jid}`)
  await checkAndNotify(jid, sock, tentativa)
}

iniciarTeste()
