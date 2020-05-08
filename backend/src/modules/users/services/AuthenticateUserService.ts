import { sign } from 'jsonwebtoken'; // generate token authentication
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	user: User;
	token: string;
}

@injectable()
class AuthenticateUserService {
	constructor(
		@inject('UsersRepository')
		private userRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ email, password }: IRequest): Promise<IResponse> {
		// verifying email
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new AppError('Incorrect email/password combination.', 401);
		}
		// verifying pass
		const passwordMatched = await this.hashProvider.compareHash(
			password,
			user.password,
		);

		if (!passwordMatched) {
			throw new AppError('Incorrect email/password combination.', 401);
		}

		const { secret, expiresIn } = authConfig.jwt;

		const token = sign({}, secret, {
			subject: user.id, // subject is goint to be always ID
			expiresIn, // time to expire and the user need to login again
		}); // sigh method receives two params. First is info we want to send to frontend and it easy to uncrypt. Second is a internal password. Third is settings of the token. It returns a jwt token.

		return {
			user,
			token,
		};
	}
}

export default AuthenticateUserService;
