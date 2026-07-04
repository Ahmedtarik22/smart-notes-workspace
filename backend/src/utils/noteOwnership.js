function buildOwnedNoteQuery(userId, noteId) {
  return {
    _id: noteId,
    userId,
  };
}

module.exports = buildOwnedNoteQuery;
