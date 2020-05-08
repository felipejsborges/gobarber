import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { name, email, password } = request.body;

		const createUser = container.resolve(CreateUserService);

		const user = await createUser.execute({ name, email, password });

		delete user.password; // deleting because it cannot be showed in response. But is safe in the DB

		return response.json(user);
	}
}
