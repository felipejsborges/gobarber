import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeUsersTokensRepository = new FakeUsersTokensRepository();
		fakeHashProvider = new FakeHashProvider();
		resetPassword = new ResetPasswordService(
			fakeUsersRepository,
			fakeUsersTokensRepository,
			fakeHashProvider,
		);
	});

	it('should be able to reset the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'Joao Donald',
			email: 'joaodonald@test.com',
			password: 'oldpassword',
		});

		const { token } = await fakeUsersTokensRepository.generate(user.id);

		const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

		await resetPassword.execute({
			password: 'newpassword',
			token,
		});

		const updatedUser = await fakeUsersRepository.findById(user.id);

		expect(generateHash).toHaveBeenCalledWith('newpassword');
		expect(updatedUser?.password).toBe('newpassword');
	});

	it('should not be able to reset the password with non-existing token', async () => {
		await expect(
			resetPassword.execute({
				token: 'non-existing-token',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to reset the password with non-existing user', async () => {
		const { token } = await fakeUsersTokensRepository.generate(
			'non-existing-user',
		);

		await expect(
			resetPassword.execute({
				token,
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to reset the password if passed more than 2 hours', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Donald',
			email: 'joaodonald@test.com',
			password: 'oldpassword',
		});

		const { token } = await fakeUsersTokensRepository.generate(user.id);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date();

			return customDate.setHours(customDate.getHours() + 3);
		});

		await expect(
			resetPassword.execute({
				password: 'newpasword',
				token,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
