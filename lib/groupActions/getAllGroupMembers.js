const GRUPO_COMUNIDADE = '120363355256548121@g.us'

async function getAllGroupMembers(sock, groupId = GRUPO_COMUNIDADE) {
  try {
    const metadata = await sock.groupMetadata(groupId)
    return metadata.participants.map(p => ({
      jid: p.id,
      phone: p.id.split('@')[0]
    }))
  } catch (err) {
    console.error(`Erro ao obter membros do grupo ${groupId}:`, err)
    return []
  }
}

module.exports = { getAllGroupMembers }
