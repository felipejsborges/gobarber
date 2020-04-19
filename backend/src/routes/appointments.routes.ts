import { Router } from 'express';
import { parseISO } from 'date-fns'; // parseISO turn a string type date into a date type. startofHour set to 0 -> minutes, seconds, ms, returning only the hour. ex: 20:13:34 -> 20:00:00. isEqual verify if a date is equal to another one
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository(); // Im instancing the class of AppointmentsRepository from repositories/AppointmentsRepository.ts

// creating a route to list all appointments:
appointmentsRouter.get('/', (request, response) => {
	const appointments = appointmentsRepository.all(); // Im calling the all method of appointmentsRepository class of models/appointmentsRepository
	return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
	// I will try to do what is inside try scope. If at some step I receive a error msg (like the throw at CreateAppointmentServers), Im going to catch and err (this is before the scope of try)
	try {
		const { provider, date } = request.body; // getting body info

		const parsedDate = parseISO(date); // turn date into a date type. i'm just changing the info type, its not a business rule

		const createAppointment = new CreateAppointmentService(
			appointmentsRepository,
		);

		const appointment = createAppointment.execute({
			date: parsedDate,
			provider,
		});

		return response.json(appointment); // responsing the appointment information
	} catch (err) {
		return response.status(400).json({ error: err.message }); // err is the error received of CreateAppointmentService and err.message is the message of the global class Error
	}
});

export default appointmentsRouter;
