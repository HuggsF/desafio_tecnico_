// app/Controllers/Http/MessagesController.ts

import { sendToQueue } from '#start/rabbitMQ';
import { HttpContext } from '@adonisjs/core/http';


export default class MessageController {
  public async send({ request, response }: HttpContext) {
    const { queue, message, id } = request.only(['queue', 'message', 'id']);
    try {
      await sendToQueue(queue, message, id);
      console.log('Message sent');
      return response.ok({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      return response.internalServerError({ error: 'Failed to send message' });
    }
  }
}
