// lib/groupActions/handleUserExit.js

const moment = require('moment')
const { getUserRowByPhone, updateUserCell } = require('../sheets/addNewUserToSheets')
const { adicionarLinhaFeedback } = require('../sheets/feedbackSaida')
const { sendExitFeedbackMessage } = require('../feedback/sendExitFeedbackMessage')

const TARGET_GROUP_ID = '120363355256548121@g.us'

async function handleUserExit(sock, update) {
  const { id, participants, author, action } = update

  if (id !== TARGET_GROUP_ID || action !== 'remove' || !participants || !Array.isArray(participants)) return

  for (const jid of participants) {
    const phone = jid.split('@')[0]
    const removedByAdmin = author && author !== jid
    const motivoSaida = removedByAdmin ? 'removido' : ''
    console.log(`🚪 Usuário saiu do grupo: ${phone}`)

    try {
      const user = await getUserRowByPhone(phone)

      if (user) {
        await updateUserCell(user.index, 'is_member', 'não')
        console.log(`✅ Atualizado na planilha: ${phone} -> is_member: não`)

        const row = [
          phone,
          user.Name || '',
          moment().format('DD/MM/YYYY'),
          '',
          motivoSaida,
          ''
        ]
        await adicionarLinhaFeedback(row)

        if (!removedByAdmin) {
          await sendExitFeedbackMessage(jid, sock)
        }
      } else {
        console.log(`⚠️ Usuário ${phone} não encontrado na planilha.`)
      }
    } catch (err) {
      console.error(`❌ Erro ao processar saída de ${phone}:`, err.message || err)
    }
  }
}

module.exports = { handleUserExit }
