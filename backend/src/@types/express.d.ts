declare namespace Express {
	// Im creating a type inside express in the Request method: Now we have request.user and it returns a id of type string. Now I can have the user id in all routes that need authentication
	export interface Request {
		user: {
			id: string;
		};
	}
}
