import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

class AppointmentsRepository implements IAppointmentsRepository {
	private ormRepository: Repository<Appointment>;

	constructor() {
		this.ormRepository = getRepository(Appointment);
	}

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		// since it's an asynchronous function, we need to set the return type as a promise, and its promise will have the type Appointment or null
		// verifying if date exists in other appointment
		const findAppointment = await this.ormRepository.findOne({
			where: { date },
			// this is short syntax of date: date, what means that it will find one appointment where the colum date contains the value 'date'
		});
		// this function above has to be async/await because i have to access the DB. findOne is a function of Repository, and, in this case, will find an appointment where date = date
		return findAppointment; // the two vertical bars means like an else inside an if -> if findAppointment exists, return it, if not, return 'null'
	}

	public async create({
		provider_id,
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = this.ormRepository.create({ provider_id, date });

		await this.ormRepository.save(appointment);

		return appointment;
	}
}

export default AppointmentsRepository;
