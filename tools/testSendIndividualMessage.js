const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { google } = require('googleapis')
const path = require('path')

// Mensagens variadas
const mensagens = [
  require('./messages_templates/dica_bond_assedio'),
  require('./messages_templates/dica_bond_assedio_v2'),
  require('./messages_templates/dica_bond_assedio_v3'),
]

// Configurações
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json')
const SPREADSHEET_ID = '1-4SpToBWDsWTf7QK0LNhgaS3PUUktnYbIZ0OO78fwSc'
const SHEET_NAME = 'mensagens_individuais'
const LIMITE_ENVIOS = 20

// Delay aleatório entre 45 e 90 segundos
function delayRandom(min = 45000, max = 90000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Autenticação Google Sheets
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient })
}

// Execução principal
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state })
  sock.ev.on('creds.update', saveCreds)

  const sheets = await getSheetsClient()

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:B`,
  })

  const linhas = res.data.values || []
  const pendentes = linhas
    .map((row, i) => ({ phone: row[0], enviado: row[1], row: i + 2 }))
    .filter(l => !l.enviado)
    .slice(0, LIMITE_ENVIOS)

  console.log(`📤 Enviando mensagens para ${pendentes.length} contatos...`)

  for (let i = 0; i < pendentes.length; i++) {
    const { phone, row } = pendentes[i]
    const jid = phone + '@s.whatsapp.net'
    const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)]

    try {
      await sock.sendMessage(jid, { text: mensagem })
      console.log(`✅ Mensagem enviada para ${phone}`)

      const hoje = new Date().toISOString().split('T')[0]

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!B${row}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[hoje]],
        },
      })
    } catch (err) {
      console.error(`❌ Erro ao enviar para ${phone}:`, err.message || err)
    }

    if (i < pendentes.length - 1) await delayRandom()
  }

  console.log('🏁 Envio finalizado.')
}

start()
