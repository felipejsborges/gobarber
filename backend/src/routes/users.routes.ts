import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig); // now our upload configuration turn in a middleware of multer. So we can use it in a route

usersRouter.post('/', async (request, response) => {
	const { name, email, password } = request.body;

	const createUser = new CreateUserService();

	const user = await createUser.execute({ name, email, password });

	delete user.password; // deleting because it cannot be showed in response. But is safe in the DB

	return response.json(user);
});

usersRouter.patch(
	'/avatar',
	ensureAuthenticated,
	upload.single('avatar'),
	async (request, response) => {
		const updateUserAvatar = new UpdateUserAvatarService();

		const user = await updateUserAvatar.execute({
			user_id: request.user.id,
			avatarFilename: request.file.filename,
		});

		delete user.password;

		return response.json(user);
	},
);

export default usersRouter;
