// lib/sheets/getAllMembersToSheet.js

const { getAllGroupMembers } = require('../groupActions/getAllGroupMembers')
const { hasProfilePicture } = require('../photoChecker/hasProfilePicture')
const { adicionarLinha } = require('./addNewUserToSheets')

// Tempo entre gravações para evitar bloqueios na API do Sheets (em milissegundos)
const DELAY_MS = 500

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getAllMembersToSheet(sock) {
  const membros = await getAllGroupMembers(sock)

  for (let i = 0; i < membros.length; i++) {
    const { phone, jid } = membros[i]
    console.log(`🔍 Verificando ${phone} (${i + 1}/${membros.length})`)

    const hasPhoto = await hasProfilePicture(jid, sock)

    const linha = [ '', phone, hasPhoto ? 'sim' : 'não', '', '', '', '', '' ]

    try {
      await adicionarLinha(linha)
      console.log(`✅ Adicionado: ${phone} com foto: ${hasPhoto}`)
    } catch (err) {
      console.error(`❌ Erro ao adicionar ${phone}:`, err.message || err)
    }

    await sleep(DELAY_MS)
  }
}

module.exports = { getAllMembersToSheet }
