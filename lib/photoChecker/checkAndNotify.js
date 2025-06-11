const { hasProfilePicture } = require('./hasProfilePicture')
const { removeParticipantFromGroup } = require('../groupActions/removeParticipant')
const {
  getUserRowByPhone,
  updateUserCell,
  updateUserCells
} = require('../sheets/addToSheets')

const { sendFirstWarning } = require('./sendFirstWarning')
const { sendSecondWarning } = require('./sendSecondWarning')
const { sendRemovalNotice } = require('./sendRemovalNotice')

const GRUPO_COMUNIDADE = '120363355256548121@g.us'

async function checkAndNotify(jid, sock, tentativa) {
  const phone = jid.split('@')[0]
  console.log(`📍 Verificando ${phone} – Tentativa ${tentativa}`)

  const row = await getUserRowByPhone(phone)
  if (!row) {
    console.log(`⚠️ ${phone}: não encontrado na planilha.`)
    return
  }

  const temFoto = await hasProfilePicture(jid, sock)

  if (temFoto) {
    console.log(`✅ ${phone} tem foto de perfil.`)
    await updateUserCell(row.index, 'has picture', 'sim')
    return
  }

  if (tentativa === 1 && !row['aviso foto 1']) {
    console.log(`🚨 ${phone}: enviando 1º aviso.`)
    await sendFirstWarning(jid, sock)
    await updateUserCell(row.index, 'aviso foto 1', new Date().toLocaleString())
    return
  }

  if (tentativa === 2 && !row['aviso foto 2']) {
    console.log(`⚠️ ${phone}: enviando 2º aviso.`)
    await sendSecondWarning(jid, sock)
    await updateUserCell(row.index, 'aviso foto 2', new Date().toLocaleString())
    return
  }

  if (tentativa === 3 && !row['aviso 3 removido']) {
    console.log(`❌ ${phone}: será removido – 3ª tentativa sem foto.`)
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

  console.log(`⏭️ ${phone}: já recebeu notificação nesta tentativa ou já foi removido.`)
}

module.exports = { checkAndNotify }
