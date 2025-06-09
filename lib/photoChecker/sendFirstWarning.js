const MENSAGEM_AVISO_1 = `
👀 Oi! Tudo bem?

Percebi que sua *foto de perfil não está visível para todos*.  
Aqui no Bond, pedimos que ela esteja liberada para manter um ambiente mais seguro e acolhedor 💚🧡

Pra ajustar:  
> WhatsApp > Configurações > Privacidade > Foto de perfil > *Todos*

Assim você mostra que é uma pessoa real — e ajuda a comunidade a ser mais leve e confiável 🫶
`

async function sendFirstWarning(jid, sock) {
  try {
    // Garante que o número está no formato certo
    const phone = jid.split('@')[0]
    const validJid = `${phone}@s.whatsapp.net`

    await sock.sendMessage(validJid, { text: MENSAGEM_AVISO_1 })
    console.log(`⚠️ Aviso 1 enviado para ${validJid}`)
  } catch (err) {
    console.error(`Erro ao enviar aviso 1 para ${jid}:`, err)
  }
}

module.exports = { sendFirstWarning }
