import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs'; // method to compare encrypted passwords
import { sign } from 'jsonwebtoken'; // generate token authentication
import AppError from '../errors/AppError';

import User from '../models/User';
import authConfig from '../config/auth';

interface Request {
	email: string;
	password: string;
}

interface Response {
	user: User;
	token: string;
}

class AuthenticateUserService {
	public async execute({ email, password }: Request): Promise<Response> {
		const userRepository = getRepository(User);
		// verifying email
		const user = await userRepository.findOne({
			where: { email },
		});

		if (!user) {
			throw new AppError('Incorrect email/password combination.', 401);
		}
		// verifying pass
		const passwordMatched = await compare(password, user.password);

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
