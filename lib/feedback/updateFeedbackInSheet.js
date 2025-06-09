const { GoogleSpreadsheet } = require('google-spreadsheet')
const path = require('path')
const creds = require(path.join(__dirname, '../../credentials.json'))

const SPREADSHEET_ID = '1-4SpToBWDsWTf7QK0LNhgaS3PUUktnYbIZ0OO78fwSc'
const SHEET_NAME = 'FeedbackSaída'

async function updateFeedbackInSheet(phone, feedback) {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle[SHEET_NAME]
  await sheet.loadHeaderRow()

  const rows = await sheet.getRows()
  const row = rows.find(r => r.phone === phone && !r['feedback adicional'])

  if (row) {
    row['feedback adicional'] = feedback
    await row.save()
  }
}

module.exports = { updateFeedbackInSheet }
