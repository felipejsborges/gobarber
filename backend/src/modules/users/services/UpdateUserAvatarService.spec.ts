import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('CreateAppointment', () => {
	it('should be able to update user avatar', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		expect(user.avatar).toBe('avatar.jpg');
	});

	it('should not be able to update avatar of a non existing user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		await expect(
			updateUserAvatar.execute({
				user_id: 'non-existing-user',
				avatarFilename: 'avatar.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should delete old avatar when updating', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();

		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const updateUserAvatar = new UpdateUserAvatarService(
			fakeUsersRepository,
			fakeStorageProvider,
		);

		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: '123456',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar.jpg',
		});

		await updateUserAvatar.execute({
			user_id: user.id,
			avatarFilename: 'avatar2.jpg',
		});

		expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
		expect(user.avatar).toBe('avatar2.jpg');
	});
});
