const { GoogleSpreadsheet } = require('google-spreadsheet')
const path = require('path')
const creds = require(path.join(__dirname, '../../credentials.json'))

const SPREADSHEET_ID = 'SUA_ID_DA_PLANILHA'
const SHEET_NAME = 'FeedbackSaída'

async function writeExitToSheet({ phone, timestamp, motivo, feedback }) {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle[SHEET_NAME]

  await sheet.addRow({
    phone,
    'saiu em': timestamp,
    'motivo saída': motivo || '',
    'feedback adicional': feedback || ''
  })
}

module.exports = { writeExitToSheet }
