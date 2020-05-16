import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '../../../repositories/INotificationsRepository';
import Notification from '../schemas/Notification';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationsRepository {
	private ormRepository: MongoRepository<Notification>;

	constructor() {
		this.ormRepository = getMongoRepository(Notification, 'mongo'); // we need to set 'mongo' as a param because the default DB is postgres
	}

	public async create({
		content,
		recipient_id,
	}: ICreateNotificationDTO): Promise<Notification> {
		const notification = this.ormRepository.create({
			content,
			recipient_id,
		});

		await this.ormRepository.save(notification);

		return notification;
	}
}

export default NotificationsRepository;
