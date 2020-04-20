import { Router } from 'express';
import { getCustomRepository } from 'typeorm'; // getCustomRepository is used to import the functions of Repository class that is extending on repositories/AppointmentsRepository.ts
import { parseISO } from 'date-fns'; // parseISO turn a string type date into a date type. startofHour set to 0 -> minutes, seconds, ms, returning only the hour. ex: 20:13:34 -> 20:00:00. isEqual verify if a date is equal to another one

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

// creating a route to list all appointments:
appointmentsRouter.get('/', async (request, response) => {
	const appointmentsRepository = getCustomRepository(AppointmentsRepository); // now I can use function of Repository using appointmentsRepository.(ctrl+space)
	const appointments = await appointmentsRepository.find(); // find function with no params returns all that has on the repository
	return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
	// I will try to do what is inside try scope. If at some step I receive a error msg (like the throw at CreateAppointmentServers), Im going to catch and err (this is before the scope of try)
	try {
		const { provider, date } = request.body; // getting body info

		const parsedDate = parseISO(date); // turn date into a date type. i'm just changing the info type, its not a business rule

		const createAppointment = new CreateAppointmentService();

		const appointment = await createAppointment.execute({
			date: parsedDate,
			provider,
		});

		return response.json(appointment); // responsing the appointment information
	} catch (err) {
		return response.status(400).json({ error: err.message }); // err is the error received of CreateAppointmentService and err.message is the message of the global class Error
	}
});

export default appointmentsRouter;
