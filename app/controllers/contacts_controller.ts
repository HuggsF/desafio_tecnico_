import Contact from '#models/contact'
import type { HttpContext } from '@adonisjs/core/http'


export default class ContactsController {
    public async create({ request, response }: HttpContext) {
      const contactData = request.only(['name', 'email', 'phone']);
  
      try {
        const contact = await Contact.create(contactData);
        return response.status(201).json(contact);
      } catch (error) {
        console.error(error);
        return response.status(400).json({ error: 'Failed to create contact.' });
      }
    }
  
    public async index({ response }: HttpContext) {
      try {
        const contacts = await Contact.all();
        return response.status(200).json(contacts);
      } catch (error) {
        console.error(error);
        return response.status(400).json({ error: 'Failed to fetch contacts.' });
      }
    }
  
    public async show({ params, response }: HttpContext) {
      try {
        const contact = await Contact.findOrFail(params.id);
        return response.status(200).json(contact);
      } catch (error) {
        console.error(error);
        return response.status(404).json({ error: 'Contact not found.' });
      }
    }
  
    public async update({ params, request, response }: HttpContext) {
      const contactData = request.only(['name', 'email', 'phone']);
  
      try {
        const contact = await Contact.findOrFail(params.id);
        contact.merge(contactData);
        await contact.save();
        return response.status(200).json(contact);
      } catch (error) {
        console.error(error);
        return response.status(404).json({ error: 'Contact not found.' });
      }
    }
  
    public async destroy({ params, response }: HttpContext) {
      try {
        const contact = await Contact.findOrFail(params.id);
        await contact.delete();
        return response.status(204);
      } catch (error) {
        console.error(error);
        return response.status(404).json({ error: 'Contact not found.' });
      }
    }
  }