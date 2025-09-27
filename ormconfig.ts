import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost', // replace with your DB host
	port: 5432, // replace with your DB port
	username: 'postgres', // replace with your DB username
	password: '0000', // replace with your DB password
	database: 'halalfood', // replace with your DB name
	entities: ['src/database/entities/*.ts'],
	migrations: ['src/database/migrations/*.ts'],
	synchronize: false,
});
