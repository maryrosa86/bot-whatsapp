const DESTINATION = '120363394901341878@g.us' // grupo de destino
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Armazena o timestamp do último envio por número
const lastSentMap = new Map()

// Tempo mínimo entre envios (em milissegundos)
const COOLDOWN = 60 * 1000  // 1 minuto

async function sendExitFeedbackMessage(jid, sock) {
  try {
    const phone = jid.split('@')[0]
    // const rawPhone = jid.split('@')[0]
//const phone = rawPhone.startsWith('55') ? rawPhone.slice(2) : rawPhone


    const message = `📤 *${phone} saiu do grupo*\n\n📣 *Coletar feedback*\nOi, tudo bem?\nNotamos que saiu do BondVibe.\nGostaria de compartilhar com a gente o motivo da sua saída, para que possamos melhorar nossa comunidade?\n\n1️⃣ Muita panelinha\n2️⃣ Muitas mensagens\n3️⃣ Sem tempo para eventos\n4️⃣ Não me senti acolhido\n5️⃣ Não entendi como funciona\n6️⃣ Experiência negativa com outro membro\n7️⃣ Não gosto de grupos grandes\n8️⃣ Interesses diferentes\n9️⃣ Outro motivo\n\n*Responda apenas com o número da opção.* 💛`

    const now = Date.now()
    const lastSent = lastSentMap.get(phone) || 0

    if (now - lastSent < COOLDOWN) {
      console.log(`⏱️ Ignorado: mensagem recente já enviada para ${phone}`)
      return
    }

    lastSentMap.set(phone, now)

    await delay(2000) // evita sobrecarga
    await sock.sendMessage(DESTINATION, { text: message })

    console.log(`📩 Mensagem de saída enviada para o grupo (${DESTINATION}) referente a ${phone}`)
  } catch (err) {
    console.error(`❌ Falha ao enviar mensagem para o grupo:`, err.message || err)
  }
}

module.exports = { sendExitFeedbackMessage }


// const DESTINATION = '5511959344515@s.whatsapp.net'
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// // Armazena o timestamp do último envio por número
// const lastSentMap = new Map()

// // Tempo mínimo entre envios (em milissegundos)
// const COOLDOWN = 60 * 1000  // 1 minuto

// async function sendExitFeedbackMessage(jid, sock) {
//   try {
//     const phone = jid.split('@')[0]
//     const message = `🚪 Teste: usuário saiu do grupo – telefone ${phone}`

//     const now = Date.now()
//     const lastSent = lastSentMap.get(phone) || 0

//     if (now - lastSent < COOLDOWN) {
//       console.log(`⏱️ Ignorado: mensagem recente já enviada para ${phone}`)
//       return
//     }

//     lastSentMap.set(phone, now)

//     await delay(2000) // previne sobrecarga na sessão
//     await sock.sendMessage(DESTINATION, { text: message })

//     console.log(`📩 Mensagem de saída enviada para ${DESTINATION} (referente a ${phone})`)
//   } catch (err) {
//     console.error(`❌ Falha ao enviar mensagem para ${DESTINATION}:`, err.message || err)
//   }
// }

// module.exports = { sendExitFeedbackMessage }
