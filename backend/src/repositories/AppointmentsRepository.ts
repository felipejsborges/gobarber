import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

@EntityRepository(Appointment) // its a repository of a model (models/Appointment)
class AppointmentsRepository extends Repository<Appointment> {
	public async findByDate(date: Date): Promise<Appointment | null> {
		// since it's an asynchronous function, we need to set the return type as a promise, and its promise will have the type Appointment or null
		// verifying if date exists in other appointment
		const findAppointment = await this.findOne({
			where: { date },
			// this is short syntax of date: date, what means that it will find one appointment where the colum date contains the value 'date'
		});
		// this function above has to be async/await because i have to access the DB. findOne is a function of Repository, and, in this case, will find an appointment where date = date
		return findAppointment || null; // the two vertical bars means like an else inside an if -> if findAppointment exists, return it, if not, return 'null'
	}
}

export default AppointmentsRepository;
