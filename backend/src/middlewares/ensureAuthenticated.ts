import { Request, Response, NextFunction } from 'express'; // a middleware is a function that receiveis as params Request, Response, NextFunction. But express its not running in this file directly. So I need to import Request, Response, NextFunction
import { verify } from 'jsonwebtoken'; // verify is a method to verify if token is valid and returns tokens payload -> iat (initialized at), exp (expireIn) and sub (user id)

import authConfig from '../config/auth'; // importing auth cfg
import AppError from '../errors/AppError';

interface TokenPayload {
	iat: number;
	exp: number;
	sub: string;
}

export default function ensureAuthenticated(
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		throw new AppError('JWT token is missing', 401);
	}

	const [, token] = authHeader.split(' ');

	const decoded = verify(token, authConfig.jwt.secret);
	// the verify returns a string or an object, and it bugs the system, so I have to force it return to a type: TokenPayload in this case:
	const { sub } = decoded as TokenPayload;

	request.user = {
		// user is a type I declared inside express types. Now Im setting it with sub (user id). And I can access this information in every route that this middleware is used
		id: sub,
	};

	return next();
}
