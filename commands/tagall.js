export default async function tagall(sock, groupId) {
  try {
    const groupMetadata = await sock.groupMetadata(groupId);
    const participants = groupMetadata.participants;
    const mentions = participants.map((participant) => participant.id);
    const message = mentions.map((m) => `@${m.split("@")[0]}`).join(" ");

    await sock.sendMessage(groupId, { text: message, mentions });
  } catch (error) {
    console.error("Error tagging all members:", error);
    throw new Error("Failed to tag all members: " + error.message);
  }
}
