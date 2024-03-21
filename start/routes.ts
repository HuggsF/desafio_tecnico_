import UsersController from "#controllers/users_controller";
import router from "@adonisjs/core/services/router";
import ContactsController from "#controllers/contacts_controller";
import MessageController from "#controllers/messages_controller";

router.group(() => {
  router.post('/register', [UsersController, 'create']);
  router.get('/getUsers', [UsersController, 'index']);
  router.post('/send-message', 'MessagesController.send');
  router.get('/contacts', [ContactsController, 'index']);
  router.post('/contacts', [ContactsController, 'create']);
  router.post('/send-to-queue', [MessageController,'send']);
  router.get('/update-password', [UsersController, 'updatePassword']);
  router.post('/user/:id/update-password', [UsersController, 'updatePassword'])
})