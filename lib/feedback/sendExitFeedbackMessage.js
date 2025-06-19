const DESTINATION = '5511959344515@s.whatsapp.net'

async function sendExitFeedbackMessage(jid, sock) {
  try {
    const phone = jid.split('@')[0]
    const message = `saida de usuário - telefone ${phone}`
    await sock.sendMessage(DESTINATION, { text: message })
    console.log(`📩 Mensagem de saída enviada para ${DESTINATION}`)
  } catch (err) {
    console.error(`Erro ao enviar mensagem de saída para ${jid}:`, err)
  }
}

module.exports = { sendExitFeedbackMessage }
// const MESSAGE = 'mensagem de saida'

// async function sendExitFeedbackMessage(jid, sock) {
//   try {
//     const phone = jid.split('@')[0]
//     const validJid = `${phone}@s.whatsapp.net`
//     await sock.sendMessage(validJid, { text: MESSAGE })
//     console.log(`📩 Mensagem de saída enviada para ${validJid}`)
//   } catch (err) {
//     console.error(`Erro ao enviar mensagem de saída para ${jid}:`, err)
//   }
// }

// module.exports = { sendExitFeedbackMessage }