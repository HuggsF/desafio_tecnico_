import amqp from 'amqplib';

const RABBITMQ_URL: string = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
let channel: amqp.Channel | null = null;
const queuesAssured: { [key: string]: boolean } = {};

async function startRabbitMQ() {

  const hostname = process.env.NODE_ENV === 'production' ? 'rabbitmq' : 'localhost';
  console.log(hostname)
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: hostname,
    port: 5672,
    username: 'guest',
    password: 'guest',
  });

  const channel = await connection.createChannel();

  await channel.assertQueue('testQueue', {
    durable: true,
  });

  // Further setup such as asserting exchanges, binding queues etc.

  console.log('RabbitMQ started and queue testQueue asserted');
}

async function getChannel(): Promise<amqp.Channel> {
  if (channel) return channel;

  const connection: amqp.Connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}

async function assureQueue(queueName: string): Promise<void> {
  if (queuesAssured[queueName]) return;
  
  const ch = await getChannel();
  await ch.assertQueue(queueName, {
    durable: true,
  });
  queuesAssured[queueName] = true;
  console.log(`Fila ${queueName} assegurada.`);
}
async function sendToQueue(queueName: string, message: string, id: number): Promise<void> {
  await assureQueue(queueName);
  if (!channel) throw new Error("Channel is not initialized");
  
  // Cria um objeto contendo tanto a message quanto o id
  const messageObj = { message, id };
  
  // Converte o objeto em uma string JSON para enviar
  const messageStr = JSON.stringify(messageObj);
  
  // Envia a string JSON para a fila
  channel.sendToQueue(queueName, Buffer.from(messageStr), {
    persistent: true,
  });
  console.log(`[x] Sent message with id ${id}: ${message}`);
}

async function consume(queueName: string, callback: (msg: string) => void): Promise<void> {
  await assureQueue(queueName);
  if (!channel) throw new Error("Channel is not initialized");

  channel.consume(queueName, message => {
    if (message) {
      console.log(`[x] Received ${message.content.toString()}`);
      callback(message.content.toString());
      channel!.ack(message);
      
    }
    
  })
}

export { sendToQueue, consume, startRabbitMQ };
