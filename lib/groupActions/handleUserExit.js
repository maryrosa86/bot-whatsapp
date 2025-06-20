const moment = require('moment')
const { getUserRowByPhone } = require('../sheets/addNewUserToSheets')
const { deleteUserRowByIndexAcessoSheets } = require('../sheets/deleteUserRowByIndexAcessoSheets')
const { addNewUserToFeedbackSheets } = require('../sheets/addNewUserToFeedbackSheets')
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
        await deleteUserRowByIndexAcessoSheets(user.index)
      } else {
        console.log(`⚠️ Usuário ${phone} não encontrado na Acesso_junho`)
      }

      // const row = [
      //   phone,
      //   user?.Name || '',
      //   moment().format('DD/MM/YYYY'),
      //   '',
      //   motivoSaida,
      //   ''
      // ]
      const row = [
        phone,                                // phone
        user?.Name || '',                     // name (opcional)
        user?.['data ingresso'] || '',        // ✅ nova coluna: data ingresso
        moment().format('DD/MM/YYYY'),        // saiu em (hoje)
        '',                                   // responde?
        motivoSaida,                          // motivo saída
        ''                                    // feedback adicional
      ]
      await addNewUserToFeedbackSheets(row)

      if (!removedByAdmin) {
        await sendExitFeedbackMessage(jid, sock)
      }

    } catch (err) {
      console.error(`❌ Erro ao processar saída de ${phone}:`, err.message || err)
    }
  }
}

module.exports = { handleUserExit }
