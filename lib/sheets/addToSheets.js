const { google } = require('googleapis')
const path = require('path')

const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1-4SpToBWDsWTf7QK0LNhgaS3PUUktnYbIZ0OO78fwSc'
const SHEET_NAME = 'Acesso_junho'

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  })

  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient })
}

async function adicionarLinha(dados) {
  const sheets = await getSheetsClient()
  const range = `${SHEET_NAME}!A1`

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [dados],
    },
  })
}

// async function getUserRowByPhone(phone) {
//   const sheets = await getSheetsClient()
//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId: SPREADSHEET_ID,
//     range: `${SHEET_NAME}!A1:Z1000`,
//   })

//   const rows = res.data.values || []
//   const headers = rows[0]

//   for (let i = 1; i < rows.length; i++) {
//     if (rows[i][1] === phone) {
//       const row = Object.fromEntries(headers.map((h, idx) => [h, rows[i][idx] || '']))
//       row.index = i + 1 // Google Sheets is 1-based
//       return row
//     }
//   }

//   return null
// }
async function getUserRowByPhone(phone) {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:Z`, // ← sem limite de linhas
  })

  const rows = res.data.values || []
  const headers = rows[0]
  const target = phone.replace(/\D/g, '').trim()

  console.log(`🔍 Procurando por: ${target}`)

  for (let i = 1; i < rows.length; i++) {
    const linha = rows[i]
    const raw = linha[1] || ''
    const normalizado = raw.replace(/\D/g, '').trim()

    // console.log(`📄 Linha ${i + 1}: ${raw} → ${normalizado}`)

    if (normalizado === target) {
      const row = Object.fromEntries(headers.map((h, idx) => [h, linha[idx] || '']))
      row.index = i + 1
      return row
    }
  }

  console.log(`❌ ${phone} não encontrado após verificação.`)
  return null
}




async function updateUserCell(rowIndex, columnName, value) {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:Z1`,
  })

  const headers = res.data.values[0]
  const colIndex = headers.indexOf(columnName)

  if (colIndex === -1) {
    throw new Error(`Coluna "${columnName}" não encontrada`)
  }

  const columnLetter = String.fromCharCode(65 + colIndex)
  const cell = `${SHEET_NAME}!${columnLetter}${rowIndex}`

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: cell,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[value]],
    },
  })
}

async function updateUserCells(rowIndex, data) {
  for (const [column, value] of Object.entries(data)) {
    await updateUserCell(rowIndex, column, value)
  }
}

module.exports = {
  adicionarLinha,
  getUserRowByPhone,
  updateUserCell,
  updateUserCells,
  getSheetsClient
}