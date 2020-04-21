import { getRepository } from 'typeorm'; // we dont need to create a repo file if we wont create a function that typeorm already have. Just use (getRepository) using the model as a param
import { hash } from 'bcryptjs'; // method to encrypt the password

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	public async execute({ name, email, password }: Request): Promise<User> {
		const userRepository = getRepository(User);

		const checkUserExists = await userRepository.findOne({
			where: { email },
		});

		if (checkUserExists) {
			throw new AppError('Email address already used.');
		}

		const hashedPassword = await hash(password, 8); // method hash to encrypt password

		const user = userRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		await userRepository.save(user); // create just create, so I need to save

		return user;
	}
}

export default CreateUserService;
