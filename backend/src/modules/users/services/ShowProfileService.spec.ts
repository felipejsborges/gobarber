import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();

		showProfile = new ShowProfileService(fakeUsersRepository);
	});

	it('should be able to show the profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: '123456',
		});

		const profile = await showProfile.execute({
			user_id: user.id,
		});

		expect(profile.name).toBe('Joao Donald');
		expect(profile.email).toBe('joaodonald@test.com');
	});

	it('should not be able to show profile of a non-existing user', async () => {
		await expect(
			showProfile.execute({
				user_id: 'non-existing user ID',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
