import {
	MigrationInterface,
	QueryRunner,
	TableColumn,
	TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1587484403597
	implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('appointments', 'provider'); // it can be decorated. You know what change you can apply in the table, so type await queryRunner. and ctrl + space, find what are you looking for, and read what params it needs: table?, colum? what type is that value? there's no secret
		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				name: 'provider_id',
				type: 'uuid',
				isNullable: true, // I set this true because I can have an appointment with no provider (if one is excluded of the system, the appointments cannot just go away)
			}),
		);
		// SQL DB's need a ForeignKey to link a table to another. In this case, I want to link provider_id with column 'id' of table 'users'
		await queryRunner.createForeignKey(
			'appointments',
			new TableForeignKey({
				name: 'AppointmentProvider', // I have to set a name to use in down method
				columnNames: ['provider_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
				onDelete: 'SET NULL', // Restrict -> it can be deleted if go to impact the other table. Cascade -> by deleting, delete all columns of the other table. Set null -> set the linked field as null
				onUpdate: 'CASCADE',
			}),
		);
	}

	// now I have to undo all changes made, by reverse order
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
		await queryRunner.dropColumn('appointments', 'provider_id');
		await queryRunner.addColumn(
			'appointments',
			new TableColumn({
				// just copy the data of provider colum on appointments table:
				name: 'provider',
				type: 'varchar',
			}),
		);
	}
}
