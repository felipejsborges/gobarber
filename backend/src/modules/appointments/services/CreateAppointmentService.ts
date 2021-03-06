import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// I need to set the request (info that is ariving inside of this service file) type
interface IRequest {
	provider_id: string;
	user_id: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,

		@inject('NotificationsRepository')
		private notificationsRepository: INotificationsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	// A service has only ONE method. This method is 'execute'. It means: Im executing a unique method. It has to be public because I will call it in another file
	public async execute({
		provider_id,
		user_id,
		date,
	}: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date); // Im not just handle the info, Im saying that a appointment can be booked only in full hour (17h, 18h, etc). This is a business rule, so couldnt stay on routes file

		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError("You can't create an appointment on a past date");
		}

		if (user_id === provider_id) {
			throw new AppError(
				"You can't create an appointment with same user as provider",
			);
		}

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError(
				'You can only create an appointment between 8am and 5pm',
			);
		}

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
			provider_id,
		);

		// if exists an appointment in the same date/hour, the findByDate method of appointmentsRepository class of models/appointmentsRepository will return it, if not, will return 'null'. So I check if findAppointment exists, and if its true, I return an error:
		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked'); // this Error class is a global class that returns a message. Its a string and your content is what we set inside the () of Error. So, in that case, We have this Error returning message: 'This appointment is already booked'
		}

		const appointment = await this.appointmentsRepository.create({
			provider_id,
			user_id,
			date: appointmentDate,
		}); // Im sending params to appointmentsRepository class of models/appointmentsRepository and instancing appointment as the return this method

		const dateFormated = format(appointmentDate, "dd/MM/yyy 'às' HH'h'mm'min'"); // double quotes to set the date type and simple quotes to scape text from date format

		await this.notificationsRepository.create({
			recipient_id: provider_id,
			content: `Novo agendamento para o dia ${dateFormated}`,
		});

		await this.cacheProvider.invalidate(
			`provider-appointments:${provider_id}:${format(
				appointmentDate,
				'yyyy-M-d',
			)}`,
		);

		return appointment;
	}
}

export default CreateAppointmentService;
