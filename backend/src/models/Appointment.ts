import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'; // entity on type orm is imported to set the model that is going to be saved on DB

@Entity('appointments')
class Appointment {
	// We need to set this configuration because of typescript (its the same thing that to create an interface that I set a type of appointments array (and its items). If I did not do that, vscode would return me and error (red underline at appointments)
	@PrimaryGeneratedColumn('uuid') // this discard the necessity of using this.id = uuid();
	id: string;

	@Column() // if I dont send params, it means 'varchar'
	provider: string;

	@Column('timestamp with time zone')
	date: Date;
}

export default Appointment;
