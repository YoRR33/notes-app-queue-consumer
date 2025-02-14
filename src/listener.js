class Listener {
  constructor(notesService, mailSender) {
    this._notesService = notesService;
    this._mailSender = mailSender;
  }

  async listen(message) {
    try {
      // Untuk mendapatkan userId dan targetEmail dari message yang diterima.
      const { userId, targetEmail } = JSON.parse(message.content.toString());

      // Mengambil catatan dari NotesService berdasarkan userId.
      const notes = await this._notesService.getNotes(userId);

      // Untuk mengirim email dengan lampiran berupa file JSON yang berisi catatan pengguna.
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(notes)
      );
      // untuk menampilkan hasilnya ke konsol.
      console.log(result);
    } catch (error) {
      // untuk menampilkan errornya ke konsol.
      console.error(error);
    }
  }
}
module.exports = Listener;
