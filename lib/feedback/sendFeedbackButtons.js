async function sendFeedbackButtons(sock, participant) {
  const jid = participant.includes('@s.whatsapp.net') ? participant : `${participant}@s.whatsapp.net`

  const mensagem = `
Qual o principal motivo da sua saída do grupo?

1️⃣ Muita panelinha
2️⃣ Muitas mensagens
3️⃣ Sem tempo p/ eventos
4️⃣ Não me senti acolhido
5️⃣ Não entendi como funciona
6️⃣ Experiência negativa com outro membro
7️⃣ Não gosto de grupos grandes
8️⃣ Interesses diferentes
9️⃣ Outro motivo

*Responda apenas com o número da opção.* 💛
`

  try {
    await sock.sendMessage(jid, { text: mensagem })
    console.log(`✅ Mensagem de opções enviada para ${jid}`)
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem:`, error)
  }
}
module.exports = { sendFeedbackButtons }
