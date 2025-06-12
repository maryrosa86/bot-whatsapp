const { google } = require('googleapis')
const path = require('path')

const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1-4SpToBWDsWTf7QK0LNhgaS3PUUktnYbIZ0OO78fwSc'
const SHEET_NAME = 'Acesso_junho'

// Conecta com a API do Google Sheets
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  })

  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient })
}

// Adiciona uma nova linha ao final com base na coluna B (phone)
async function adicionarLinha(dados) {
  const sheets = await getSheetsClient()

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!B:B`, // Usando a coluna phone como referência
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [dados],
    },
  })
}

// Busca a linha de um usuário com base no telefone (coluna B)
async function getUserRowByPhone(phone) {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:Z1000`,
  })

  const rows = res.data.values || []
  const headers = rows[0]

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === phone) {
      const row = Object.fromEntries(headers.map((h, idx) => [h, rows[i][idx] || '']))
      row.index = i + 1 // Índice da linha na planilha (1-based)
      return row
    }
  }

  return null
}

// Atualiza uma única célula de um usuário
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

// Atualiza várias células de uma vez em uma linha
async function updateUserCells(rowIndex, data) {
  for (const [column, value] of Object.entries(data)) {
    await updateUserCell(rowIndex, column, value)
  }
}

// Exporta as funções
module.exports = {
  adicionarLinha,
  getUserRowByPhone,
  updateUserCell,
  updateUserCells,
}
