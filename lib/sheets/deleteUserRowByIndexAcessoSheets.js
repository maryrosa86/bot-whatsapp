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

async function deleteUserRowByIndexAcessoSheets(rowIndex) {
  const sheets = await getSheetsClient()

  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // geralmente é 0 para a primeira aba; se não funcionar, posso te ensinar a pegar o ID certo
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // Google Sheets é 0-based, mas index vem como 1-based
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    })
    console.log(`🗑️ Linha ${rowIndex} removida da aba Acesso_junho`)
  } catch (err) {
    throw new Error(`Erro ao tentar deletar linha ${rowIndex}: ${err.message}`)
  }
}

module.exports = { deleteUserRowByIndexAcessoSheets }
