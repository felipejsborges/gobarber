import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// I need to set the request (info that is ariving inside of this service file) type
interface Request {
	provider: string;
	date: Date;
}

class CreateAppointmentService {
	// Here I will need to access the AppointmentsRepository. If I start a new (new AppointmentsRepository()), its gonna be diferente from the other created in appointment.routes. So I have to receive it as a param of the constructor method of my class
	private appointmentsRepository: AppointmentsRepository; // Im creating a private var. I will call it in the constructor function:

	constructor(appointmentsRepository: AppointmentsRepository) {
		this.appointmentsRepository = appointmentsRepository; // Setting my previous created var with the appointmentsRepository that arrived by this constructor arg
	}

	// A service has only ONE method. This method is 'execute'. It means: Im executing a unique method. It has to be public because I will call it in another file
	public execute({ provider, date }: Request): Appointment {
		const appointmentDate = startOfHour(date); // Im not just handle the info, Im saying that a appointment can be booked only in full hour (17h, 18h, etc). This is a business rule, so couldnt stay on routes file

		const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
			appointmentDate,
		);

		// if exists an appointment in the same date/hour, the findByDate method of appointmentsRepository class of models/appointmentsRepository will return it, if not, will return 'null'. So I check if findAppointment exists, and if its true, I return an error:
		if (findAppointmentInSameDate) {
			throw Error('This appointment is already booked'); // this Error class is a global class that returns a message. Its a string and your content is what we set inside the () of Error. So, in that case, We have this Error returning message: 'This appointment is already booked'
		}

		const appointment = this.appointmentsRepository.create({
			provider,
			date: appointmentDate,
		}); // Im sending params to appointmentsRepository class of models/appointmentsRepository and instancing appointment as the return this method
		return appointment;
	}
}

export default CreateAppointmentService;
