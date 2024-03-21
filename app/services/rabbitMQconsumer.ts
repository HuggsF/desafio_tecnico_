import { Connection, connect, Channel, ConsumeMessage } from 'amqplib';
import axios from 'axios';

export default class RabbitMQConsumer {
  private static channel: Channel;

  public static async init(): Promise<void> {
    const connection: Connection = await connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('testQueue');
    this.channel.consume('testQueue', (msg: ConsumeMessage | null) => {
      if (msg) {
        console.log('Received:', msg.content.toString());
        
        try {
          const userData = JSON.parse(msg.content.toString());
          
          // Certifique-se de que o userData inclui os campos necessários
          if (userData && userData.id && userData.message) {
            const updatePasswordEndpoint = `http://localhost:3333/user/${userData.id}/update-password`;
            // Chamada do Axios para a API
            axios.post(updatePasswordEndpoint, { password: userData.message })
              .then(response => {
                console.log('Password updated successfully', response.data);
              })
              .catch(error => {
                console.error('Error updating password', error.response ? error.response.data : error);
              });
          } else {
            console.error('Invalid message structure');
          }
        } catch (error) {
          console.error('Error parsing message content', error);
        }

        // Confirma a mensagem como processada
        this.channel.ack(msg);
      }
    });
  }
}
