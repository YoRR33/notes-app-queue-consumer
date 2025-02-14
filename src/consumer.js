require("dotenv").config();

const amqp = require("amqplib");
const MailSender = require("./MailSender");
const Listener = require("./listener");
const NotesService = require("./NotesService");

const init = async () => {
  // Memanggil fungsi yang dibutuhkan
  const mailSender = new MailSender();
  const notesService = new NotesService();
  const listener = new Listener(notesService, mailSender);

  // Membuat koneksi dan channel RabbitMQ
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  // Membuat antrean serta membuat durable queue
  await channel.assertQueue("export:notes", {
    durable: true,
  });

  // Untuk mengonsumsi pesan yang ada di dalam antrean export:notes
  channel.consume("export:notes", listener.listen.bind(listener), {
    noAck: true,
  });
};

init();
