async function removeParticipantFromGroup(sock, groupId, jid) {
  try {
    await sock.groupParticipantsUpdate(groupId, [jid], 'remove')
    console.log(`👢 ${jid} was removed from group ${groupId}`)
  } catch (error) {
    console.error(`Failed to remove ${jid} from group ${groupId}:`, error)
  }
}

module.exports = { removeParticipantFromGroup }
