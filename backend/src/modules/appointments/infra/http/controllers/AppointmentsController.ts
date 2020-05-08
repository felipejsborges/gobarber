import { Request, Response } from 'express';
import { parseISO } from 'date-fns'; // parseISO turn a string type date into a date type. startofHour set to 0 -> minutes, seconds, ms, returning only the hour. ex: 20:13:34 -> 20:00:00. isEqual verify if a date is equal to another one
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
	public async create(request: Request, response: Response): Promise<Response> {
		// I will try to do what is inside try scope. If at some step I receive a error msg (like the throw at CreateAppointmentServers), Im going to catch and err (this is before the scope of try)
		const { provider_id, date } = request.body; // getting body info

		const parsedDate = parseISO(date); // turn date into a date type. i'm just changing the info type, its not a business rule
		const createAppointment = container.resolve(CreateAppointmentService);

		const appointment = await createAppointment.execute({
			date: parsedDate,
			provider_id,
		});

		return response.json(appointment); // responsing the appointment information
	}
}
