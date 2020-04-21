import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm'; // getCustomRepository is used to import the functions of Repository class that is extending on repositories/AppointmentsRepository.ts

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

// I need to set the request (info that is ariving inside of this service file) type
interface Request {
	provider_id: string;
	date: Date;
}

class CreateAppointmentService {
	// A service has only ONE method. This method is 'execute'. It means: Im executing a unique method. It has to be public because I will call it in another file
	public async execute({ provider_id, date }: Request): Promise<Appointment> {
		const appointmentsRepository = getCustomRepository(AppointmentsRepository); // now I can use function of Repository using appointmentsRepository.(ctrl+space)

		const appointmentDate = startOfHour(date); // Im not just handle the info, Im saying that a appointment can be booked only in full hour (17h, 18h, etc). This is a business rule, so couldnt stay on routes file

		const findAppointmentInSameDate = await appointmentsRepository.findByDate(
			appointmentDate,
		);

		// if exists an appointment in the same date/hour, the findByDate method of appointmentsRepository class of models/appointmentsRepository will return it, if not, will return 'null'. So I check if findAppointment exists, and if its true, I return an error:
		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked'); // this Error class is a global class that returns a message. Its a string and your content is what we set inside the () of Error. So, in that case, We have this Error returning message: 'This appointment is already booked'
		}

		const appointment = appointmentsRepository.create({
			provider_id,
			date: appointmentDate,
		}); // Im sending params to appointmentsRepository class of models/appointmentsRepository and instancing appointment as the return this method
		await appointmentsRepository.save(appointment); // the created method on Repository class only creates, so I need to save it
		return appointment;
	}
}

export default CreateAppointmentService;
