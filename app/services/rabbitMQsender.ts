import { Connection, connect, Channel } from 'amqplib';

export default class RabbitMQSender {
  private static channel: Channel;

  public static async init(): Promise<void> {
    const connection: Connection = await connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('testQueue');
  }

  public static async send(message: string): Promise<boolean> {
    return this.channel.sendToQueue('testQueue', Buffer.from(message));
  }
}
