import { uuid } from 'uuidv4';

class Appointment {
	// We need to set this configuration because of typescript (its the same thing that to create an interface that I set a type of appointments array (and its items). If I did not do that, vscode would return me and error (red underline at appointments)
	id: string;

	provider: string;

	date: Date;

	// the next constructor has the same function of create an appointment object that i'll put inside a appointments array (or DB). We gonna use Omit function of typescript. It works like that: I call the funcion (Omit) and, inside the <> we have two args, first is the typer interface, second is the arg i want to omit
	constructor({ provider, date }: Omit<Appointment, 'id'>) {
		this.id = uuid();
		this.provider = provider;
		this.date = date;
	}
}

export default Appointment;
