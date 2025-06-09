// lib/photoChecker/sendRemovalNotice.js

const MENSAGEM_REMOCAO = `
Olá! 

Como sua foto de perfil não foi liberada você foi *removido da comunidade principal do BondVibe*. 

Essa medida é importante para garantir um espaço mais seguro para todos 🤍

Mas a jornada não acaba aqui:

✅ Você ainda pode participar do *app BondVibe*, disponível nas lojas de aplicativo. 

`

async function sendRemovalNotice(jid, sock) {
  try {
    await sock.sendMessage(jid, { text: MENSAGEM_REMOCAO })
    console.log(`❌ Mensagem de remoção enviada para ${jid}`)
  } catch (err) {
    console.error(`Erro ao enviar mensagem de remoção para ${jid}:`, err)
  }
}

module.exports = { sendRemovalNotice }
