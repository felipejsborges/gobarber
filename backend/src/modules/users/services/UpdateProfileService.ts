import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
	user_id: string;
	name: string;
	email: string;
	old_password?: string;
	password?: string;
}

@injectable()
class UpdateProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({
		user_id,
		name,
		email,
		old_password,
		password,
	}: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found');
		}

		const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

		if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
			throw new AppError('E-mail already in use.');
		}

		user.name = name;
		user.email = email;

		if (password && !old_password) {
			throw new AppError('Missing old password');
		}

		if (password && old_password) {
			const checkOldPassword = await this.hashProvider.compareHash(
				old_password,
				user.password,
			);
			if (!checkOldPassword) {
				throw new AppError('Wrong old password');
			}

			user.password = await this.hashProvider.generateHash(password);
		}

		return this.usersRepository.save(user);
	}
}

export default UpdateProfileService;
