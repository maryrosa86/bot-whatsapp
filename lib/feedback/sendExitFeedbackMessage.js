const DESTINATION = '5511959344515@s.whatsapp.net'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Armazena o timestamp do último envio por número
const lastSentMap = new Map()

// Tempo mínimo entre envios (em milissegundos)
const COOLDOWN = 60 * 1000  // 1 minuto

async function sendExitFeedbackMessage(jid, sock) {
  try {
    const phone = jid.split('@')[0]
    const message = `🚪 Teste: usuário saiu do grupo – telefone ${phone}`

    const now = Date.now()
    const lastSent = lastSentMap.get(phone) || 0

    if (now - lastSent < COOLDOWN) {
      console.log(`⏱️ Ignorado: mensagem recente já enviada para ${phone}`)
      return
    }

    lastSentMap.set(phone, now)

    await delay(2000) // previne sobrecarga na sessão
    await sock.sendMessage(DESTINATION, { text: message })

    console.log(`📩 Mensagem de saída enviada para ${DESTINATION} (referente a ${phone})`)
  } catch (err) {
    console.error(`❌ Falha ao enviar mensagem para ${DESTINATION}:`, err.message || err)
  }
}

module.exports = { sendExitFeedbackMessage }
