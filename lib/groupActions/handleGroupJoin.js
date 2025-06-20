


const { handleNewUser } = require('./handleNewUser')

const groupJoinQueue = {}

// ID do grupo "Acesso Junho"
const GRUPO_ACESSO_JUNHO = '120363398292974601@g.us'

// Tempo de espera em milissegundos (ex: 15 segundos sem novos membros)
const TEMPO_ESPERA = 10000

async function handleGroupJoin(sock, update) {
  const { id: groupId, participants, action } = update

  if (action !== 'add') return

  if (groupId !== GRUPO_ACESSO_JUNHO) {
    console.log(`⚠️ Participantes entraram no grupo ${groupId}, mas não é o grupo de Acesso Junho. Nenhuma mensagem será enviada.`)
    return
  }

  // Inicializa fila se não existir
  if (!groupJoinQueue[groupId]) {
    groupJoinQueue[groupId] = {
      participants: [],
      timeout: null
    }
  }

  // Adiciona novos participantes na fila
  groupJoinQueue[groupId].participants.push(...participants)

  // Se já tiver um timeout, limpa ele (pra reiniciar)
  if (groupJoinQueue[groupId].timeout) {
    clearTimeout(groupJoinQueue[groupId].timeout)
  }

  // Cria novo timeout (espera X segundos sem ninguém novo)
  groupJoinQueue[groupId].timeout = setTimeout(async () => {
    const joined = groupJoinQueue[groupId].participants
    const mentions = [...new Set(joined)]
    const numeros = mentions.map(p => `@${p.split('@')[0]}`).join(', ')

    const texto = `${numeros}

👋 *Boas-vindas ao BondVibe!*

Aqui você vai fazer novas amizades, entrar em grupos temáticos e curtir nossos eventos presenciais 🎉

💬 Os grupos têm muitas mensagens, *mas não precisa acompanhar tudo*. O mais importante é *ficar de olho no grupo de avisos*, onde mandamos os eventos e as infos essenciais.

🫂 Entre nos grupos que mais combinam com você  
👀 Leia as regras na descrição  
📅 Sugira e participe dos eventos  
🕓 Alguns grupos podem demorar pra liberar — tenha paciência!  
📸 Libere sua foto de perfil nas configurações (visível para todos)

Nosso propósito é simples: *criar conexões reais* 💚🧡

✨ *Pra começar, se apresenta aqui!*  
Conta pra gente:  
• Nome  
• Bairro ou cidade  
• Idade  
• Estado civil  
• Signo 😄♈♉♊
 
*Bora viver essa vibe!* 🚀`

    await sock.sendMessage(groupId, {
      text: texto,
      mentions
    })

    for (const jid of mentions) {
      await handleNewUser(jid.replace('@s.whatsapp.net', ''), sock)
    }

    // Limpa a fila
    groupJoinQueue[groupId] = null
  }, TEMPO_ESPERA)
}

module.exports = { handleGroupJoin }
// // lib/handleGroupJoin.js

// const { handleNewUser } = require('./handleNewUser')

// const groupJoinQueue = {}

// // ID do grupo "Acesso Junho"
// const GRUPO_ACESSO_JUNHO = '120363398292974601@g.us'

// async function handleGroupJoin(sock, update) {
//   const { id: groupId, participants, action } = update

//   if (action !== 'add') return

//   if (groupId !== GRUPO_ACESSO_JUNHO) {
//     console.log(`⚠️ Participantes entraram no grupo ${groupId}, mas não é o grupo de Acesso Junho. Nenhuma mensagem será enviada.`)
//     return
//   }

//   if (!groupJoinQueue[groupId]) {
//     groupJoinQueue[groupId] = {
//       participants: [],
//       timeout: null
//     }
//   }

//   groupJoinQueue[groupId].participants.push(...participants)

//   if (groupJoinQueue[groupId].timeout) return

//   groupJoinQueue[groupId].timeout = setTimeout(async () => {
//     const joined = groupJoinQueue[groupId].participants
//     const mentions = [...new Set(joined)]
//     const numeros = mentions.map(p => `@${p.split('@')[0]}`).join(', ')

//     const texto = `${numeros}

// 👋 *Boas-vindas ao BondVibe!*

// Aqui você vai fazer novas amizades, entrar em grupos temáticos e curtir nossos eventos presenciais 🎉

// 💬 Os grupos têm muitas mensagens, *mas não precisa acompanhar tudo*. O mais importante é *ficar de olho no grupo de avisos*, onde mandamos os eventos e as infos essenciais.

// 🫂 Entre nos grupos que mais combinam com você  
// 👀 Leia as regras na descrição  
// 📅 Sugira e participe dos eventos  
// 🕓 Alguns grupos podem demorar pra liberar — tenha paciência!  
// 📸 Libere sua foto de perfil nas configurações (visível para todos)

// Nosso propósito é simples: *criar conexões reais* 💚🧡

// ✨ *Pra começar, se apresenta aqui!*  
// Conta pra gente:  
// • Nome  
// • Bairro ou cidade  
// • Idade  
// • Estado civil  
// • Signo 😄♈♉♊
 
// *Bora viver essa vibe!* 🚀`

//     await sock.sendMessage(groupId, {
//       text: texto,
//       mentions
//     })

//     for (const jid of mentions) {
//       await handleNewUser(jid.replace('@s.whatsapp.net', ''), sock)
//     }

//     groupJoinQueue[groupId] = null
//   }, 5000)
// }

// module.exports = { handleGroupJoin }
