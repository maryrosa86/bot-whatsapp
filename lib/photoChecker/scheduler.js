// lib/photoChecker/scheduler.js

const { checkAndNotify } = require('./checkAndNotify')

function agendarVerificacaoFutura(jid, sock, tentativa) {
  const horaAtual = new Date()
  let proximaVerificacao = new Date(horaAtual.getTime() + 24 * 60 * 60 * 1000)

  const hora = proximaVerificacao.getHours()
  if (hora < 10) proximaVerificacao.setHours(10, 0, 0, 0)
  else if (hora > 20) proximaVerificacao.setHours(10, 0, 0, 0)

  const tempoAteLá = proximaVerificacao - horaAtual
  console.log(`⏰ Verificação ${tentativa} agendada para ${proximaVerificacao.toLocaleString()}`)

  setTimeout(() => checkAndNotify(jid, sock, tentativa), tempoAteLá)
}

module.exports = { agendarVerificacaoFutura }
