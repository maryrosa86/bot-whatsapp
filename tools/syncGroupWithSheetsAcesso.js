// busca todos os membros do grupo e atualiza a planilha com informações de membros e fotos de perfil
// se membro já existir, atualiza a foto de perfil e status de membro
// apagar a coluna is_member antes de rodar o script, ele so vai preencher sim
// se o membro não existir, adiciona uma nova linha com as informações

const { getAllGroupMembers } = require('../lib/groupActions/getAllGroupMembers')
const {
  getUserRowByPhone,
  updateUserCells,
  adicionarLinha
} = require('../lib/sheets/addToSheets')
const { hasProfilePicture } = require('../lib/photoChecker/hasProfilePicture')

// Função para pausar entre os membros
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function syncGroupWithSheets(sock) {
  const membros = await getAllGroupMembers(sock)
  console.log(`🔄 Iniciando sincronização: ${membros.length} membros encontrados\n`)

  let adicionados = 0
  let atualizados = 0

  for (const membro of membros) {
    const { jid, phone } = membro
    console.log(`📲 Processando: ${phone}...`)

    // Pequeno atraso para evitar sobrecarga
    await delay(1500)

    try {
      const row = await getUserRowByPhone(phone)
      console.log(`🔍 ${phone} ${row ? 'foi encontrado na planilha' : 'NÃO está na planilha'}`)

      const temFoto = await hasProfilePicture(jid, sock)
      console.log(`🖼️ ${phone} ${temFoto ? 'tem foto de perfil' : 'NÃO tem foto de perfil'}`)

      if (row) {
        await updateUserCells(row.index, {
          'is_member': 'sim',
          'has picture': temFoto ? 'sim' : 'não'
        })
        console.log(`✅ Atualizado ${phone} na planilha\n`)
        atualizados++
      } else {
        const novaLinha = [
          '',                      // Name
          phone,                   // phone
          temFoto ? 'sim' : 'não', // has picture
          'sim',                   // is_member
          ''                       // data ingresso
        ]
        await adicionarLinha(novaLinha)
        console.log(`➕ Adicionado ${phone} à planilha\n`)
        adicionados++
      }
    } catch (err) {
      console.error(`❌ Erro ao processar ${phone}:`, err.message, '\n')
    }
  }

  console.log(`✅ Sincronização concluída.\n🔁 Atualizados: ${atualizados} | ➕ Adicionados: ${adicionados}`)
}

module.exports = { syncGroupWithSheets }
