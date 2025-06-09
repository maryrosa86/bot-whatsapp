// lib/photoChecker/sendSecondWarning.js

const MENSAGEM_AVISO_2 = `
👀 Oi de novo!

Sua *foto de perfil ainda está invisível para todos*.  
Sabemos que imprevistos acontecem, mas essa é uma das poucas regras do Bond, pois ela garante segurança e conexão real entre os participantes 

Se ainda quiser fazer parte, por favor, ative sua foto nas próximas 24h:

> WhatsApp > Configurações > Privacidade > Foto de perfil > *Todos*

Estamos torcendo pra você continuar com a gente 🫆
`

async function sendSecondWarning(jid, sock) {
  try {
    await sock.sendMessage(jid, { text: MENSAGEM_AVISO_2 })
    console.log(`⚠️ Aviso 2 enviado para ${jid}`)
  } catch (err) {
    console.error(`Erro ao enviar aviso 2 para ${jid}:`, err)
  }
}

module.exports = { sendSecondWarning }
