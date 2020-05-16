import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const user_id = request.user.id;
		// I will try to do what is inside try scope. If at some step I receive a error msg (like the throw at CreateAppointmentServers), Im going to catch and err (this is before the scope of try)
		const { provider_id, date } = request.body; // getting body info

		const createAppointment = container.resolve(CreateAppointmentService);

		const appointment = await createAppointment.execute({
			date,
			provider_id,
			user_id,
		});

		return response.json(appointment); // responsing the appointment information
	}
}
