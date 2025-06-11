const moment = require('moment')
const { hasProfilePicture } = require('../photoChecker/hasProfilePicture')
const { sendFirstWarning } = require('../photoChecker/sendFirstWarning')
const { adicionarLinha } = require('../sheets/addNewUserToSheets')

async function handleNewUser(jid, sock) {
  const phone = jid.split('@')[0]
  const hasPhoto = await hasProfilePicture(jid, sock)

  const timestamp = moment().format('DD/MM/YYYY HH:mm')
  const dataIngresso = moment().format('DD/MM/YYYY')

  const newRow = [
    '',                          // Name (to be updated later)
    phone,
    hasPhoto ? 'sim' : 'não',    // has picture
    'sim',                       // is_member
    dataIngresso,                // data ingresso ← ADICIONADO AQUI
    hasPhoto ? '' : timestamp,   // aviso foto 1
    '',                          // aviso foto 2
    '',                          // aviso 3 removido
    '',                          // removido?
    ''                           // data remoção
  ]

  await adicionarLinha(newRow)
  console.log(`✅ Row added for ${phone}`)

  if (!hasPhoto) {
    await sendFirstWarning(jid, sock)
  }
}

module.exports = { handleNewUser }
