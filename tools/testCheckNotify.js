// tools/testCheckNotify.js

const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { checkAndNotify } = require('../lib/photoChecker/checkAndNotify')

// Substitua por um número de telefone real (sem + e com DDI), ex: '5511999998888'
const TEST_PHONE = '5511999998888'

// 1 = primeiro aviso, 2 = segundo aviso, 3 = remoção
const TENTATIVA = 1

async function startBot() {
  console.log('🚀 Iniciando verificação do usuário de teste...')

  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection } = update

    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp! Verificando usuário...')
     // const jid = `${TEST_PHONE}@s.whatsapp.net`
      const jid = `${TEST_PHONE}@s.whatsapp.net`

      try {
        await checkAndNotify(jid, sock, TENTATIVA)
        console.log('✅ Verificação concluída.')
      } catch (err) {
        console.error('❌ Erro durante checkAndNotify:', err)
      }
    }
  })
}

startBot()
