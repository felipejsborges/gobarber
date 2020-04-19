import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

// We need to create a interface to define the type of the data we are receiving when we create a new appointment
interface CreateAppointmentDTO {
	provider: string;
	date: Date;
}

class AppointmentsRepository {
	private appointments: Appointment[]; // I'm saying that appointments is an array of Appointment type (defined in models/appointment) and starts empty []. This is private because only our methods of this class can access this information. Other files will have access to the methods, not the saved data

	constructor() {
		this.appointments = []; // initialing the array appointments
	}

	// creating a method to return all booked appointments
	public all(): Appointment[] {
		return this.appointments;
	}

	public findByDate(date: Date): Appointment | null {
		// verifying if date exists in other appointment
		const findAppointment = this.appointments.find(appointment =>
			isEqual(date, appointment.date),
		);
		return findAppointment || null; // the two vertical bars means like an else inside an if -> if findAppointment exists, return it, if not, return 'null'
	}

	// create a method to create a new appointment using the CreateAppointmentDTO interface that was created before to initialize this class
	public create({ provider, date }: CreateAppointmentDTO): Appointment {
		// creating appointment data:
		const appointment = new Appointment({ provider, date });
		this.appointments.push(appointment); // putting appointment in the end of appointments array
		return appointment;
	}
}

export default AppointmentsRepository;
