import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		updateProfile = new UpdateProfileService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});

	it('should be able to update the profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: '123456',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'Carlos Marcos',
			email: 'carlosmarcos@test.com',
		});

		expect(updatedUser.name).toBe('Carlos Marcos');
		expect(updatedUser.email).toBe('carlosmarcos@test.com');
	});

	it('should not be able to update profile of a non-existing user', async () => {
		await expect(
			updateProfile.execute({
				user_id: 'non-existing user ID',
				name: 'Any Name',
				email: 'anyemail@test.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the email to an existing one', async () => {
		await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: '123456',
		});

		const user = await fakeUsersRepository.create({
			name: 'test',
			email: 'test@test.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'test or any other name',
				email: 'joaodonald@test.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: 'old-password',
		});

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name: 'Carlos Marcos',
			email: 'carlosmarcos@test.com',
			old_password: 'old-password',
			password: 'new-password',
		});

		expect(updatedUser.password).toBe('new-password');
	});

	it('should not be able to update the password without old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: 'old-password',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'Carlos Marcos',
				email: 'carlosmarcos@test.com',
				password: 'new-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the password with wrong old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: 'old-password',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name: 'Carlos Marcos',
				email: 'carlosmarcos@test.com',
				old_password: 'wrong-old-password',
				password: 'new-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
