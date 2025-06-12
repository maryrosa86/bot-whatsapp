// lib/groupActions/handleUserExit.js

const { getUserRowByPhone, updateUserCell } = require('../sheets/addNewUserToSheets')

const TARGET_GROUP_ID = '120363355256548121@g.us'

async function handleUserExit(sock, update) {
  const { id, participants } = update

  if (id !== TARGET_GROUP_ID || !participants || !Array.isArray(participants)) return

  for (const jid of participants) {
    const phone = jid.split('@')[0]
    console.log(`🚪 Usuário saiu do grupo: ${phone}`)

    try {
      const user = await getUserRowByPhone(phone)

      if (user) {
        await updateUserCell(user.index, 'is_member', 'não')
        console.log(`✅ Atualizado na planilha: ${phone} -> is_member: não`)
      } else {
        console.log(`⚠️ Usuário ${phone} não encontrado na planilha.`)
      }
    } catch (err) {
      console.error(`❌ Erro ao processar saída de ${phone}:`, err.message || err)
    }
  }
}

module.exports = { handleUserExit }
