//salva na planilha mensagens_individuais
// lib/sheets/saveAllPhonesToIndividualSheet.js

const { getAllGroupMembers } = require('../groupActions/getAllGroupMembers')
const { adicionarLinha } = require('./addToSentIndividualMessageSheets')

const DELAY_MS = 500

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function saveAllPhonesToIndividualSheet(sock) {
  const membros = await getAllGroupMembers(sock)

  for (let i = 0; i < membros.length; i++) {
    const { phone } = membros[i]
    console.log(`📞 Gravando telefone ${phone} (${i + 1}/${membros.length})`)

    const linha = [phone, '']

    try {
      await adicionarLinha(linha)
      console.log(`✅ Telefone adicionado à planilha: ${phone}`)
    } catch (err) {
      console.error(`❌ Erro ao adicionar ${phone}:`, err.message || err)
    }

    await sleep(DELAY_MS)
  }
}

module.exports = { saveAllPhonesToIndividualSheet }
