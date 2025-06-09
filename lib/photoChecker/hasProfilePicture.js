async function hasProfilePicture(phoneOrJid, sock) {
  try {
    const phone = phoneOrJid.split('@')[0]
    const jid = `${phone}@s.whatsapp.net`
    const url = await sock.profilePictureUrl(jid, 'image')
    return !!url
  } catch (err) {
    console.error(`⚠️ Erro ao verificar foto de ${phoneOrJid}:`, err.message || err)
    return false
  }
}


module.exports = { hasProfilePicture };
