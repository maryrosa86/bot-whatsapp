// lib/photoChecker/checkAndNotify.js

const { hasProfilePicture } = require('./hasProfilePicture')
const { removeParticipantFromGroup } = require('../groupActions/removeParticipant')
const {
  getUserRowByPhone,
  updateUserCell,
  updateUserCells
} = require('../sheets/addToSheets')

const { agendarVerificacaoFutura } = require('./scheduler')
const { sendFirstWarning } = require('./sendFirstWarning')
const { sendSecondWarning } = require('./sendSecondWarning')
const { sendRemovalNotice } = require('./sendRemovalNotice')

// ID do grupo principal da comunidade (para remoção)
const GRUPO_COMUNIDADE = '120363355256548121@g.us'

async function checkAndNotify(jid, sock, tentativa) {
  const phone = jid.split('@')[0]
  const row = await getUserRowByPhone(phone)
  if (!row) return console.log(`⚠️ Usuário ${phone} não encontrado na planilha.`)

  const temFoto = await hasProfilePicture(jid, sock)

  if (temFoto) {
    console.log(`✅ ${phone} tem foto de perfil.`)
    return updateUserCell(row.index, 'has picture', 'sim')
  }

  if (tentativa === 1 && !row['aviso foto 1']) {
    await sendFirstWarning(jid, sock)
    await updateUserCell(row.index, 'aviso foto 1', new Date().toLocaleString())
    agendarVerificacaoFutura(jid, sock, 2)
    return
  }

  if (tentativa === 2 && !row['aviso foto 2']) {
    const temFotoAtualizada = await hasProfilePicture(jid, sock)
    if (temFotoAtualizada) {
      console.log(`✅ ${phone} atualizou a foto antes do segundo aviso.`)
      return updateUserCell(row.index, 'has picture', 'sim')
    }

    await sendSecondWarning(jid, sock)
    await updateUserCell(row.index, 'aviso foto 2', new Date().toLocaleString())
    agendarVerificacaoFutura(jid, sock, 3)
    return
  }

  if (tentativa === 3 && !row['aviso 3 removido']) {
    const temFotoAtualizada = await hasProfilePicture(jid, sock)
    if (temFotoAtualizada) {
      console.log(`✅ ${phone} atualizou a foto antes da remoção.`)
      return updateUserCell(row.index, 'has picture', 'sim')
    }

    await sendRemovalNotice(jid, sock)
await removeParticipantFromGroup(sock, GRUPO_COMUNIDADE, jid)
    await updateUserCells(row.index, {
      'aviso 3 removido': new Date().toLocaleString(),
      'removido?': 'sim',
      'data remoção': new Date().toLocaleDateString(),
      'is_member': 'não'
    })
    return
  }
}

module.exports = { checkAndNotify }
