import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm'; // entity on type orm is imported to set the model that is going to be saved on DB. By default, type ORM already have the type of colums Create and UpdateData, just use it with Decorators

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
	// We need to set this configuration because of typescript (its the same thing that to create an interface that I set a type of appointments array (and its items). If I did not do that, vscode would return me and error (red underline at appointments)
	@PrimaryGeneratedColumn('uuid') // this discard the necessity of using this.id = uuid();
	id: string;

	@Column() // if I dont send params, it means 'varchar'
	provider_id: string;

	// I have to specify the type of relation of my provider_id with the id of User.ts. OneToOne, OneToMany or ManyToMany. It that case, we have many appointments for one user. So:
	@ManyToOne(() => User) // this @ManyToOne receveis as a param a funtion that returns the the class of the file that this file has relation
	@JoinColumn({ name: 'provider_id' }) // The column of User is name and it is relationing with provider_id colum of this file
	provider: User; // We set this to access info of User between the appointment

	@Column()
	user_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column('timestamp with time zone')
	date: Date;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

export default Appointment;
