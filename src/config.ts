import { join } from 'path';
import process from 'process';
import * as dotenv from 'dotenv';


dotenv.config();

export const constants = {
	API_URL: '',
};

export const secretKeyMission = 'eKYnXyM16OPHyHonAAPX7celYKBLXF1h';

const DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
const DB_PORT = process.env.DB_PORT ?? 27017;
const DB_NAME = process.env.DB_NAME ?? 'mission';
const DB_USER = process.env.DB_USER ?? 'missionUser';
const DB_PASSWORD = process.env.DB_PASSWORD ?? 'Mi$$ioN24';
const DB_AUTH_SOURCE = process.env.DB_AUTH_SOURCE ?? 'mission';
const DB_AUTH_MECHANISM = process.env.DB_AUTH_MECHANISM ?? 'SCRAM-SHA-256';

let dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}&authMechanism=${DB_AUTH_MECHANISM}`;
if (DB_USER && DB_PASSWORD) dbUri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}&authMechanism=${DB_AUTH_MECHANISM}`;

export const config = {
	DB_URI:  dbUri,
	API_PORT: process.env.PORT ?? 3000,
	ATTACHEMENT_SRC: process.env.ATTACHEMENT_SRC ?? join(__dirname, '..', 'media'),
	MOBITEACH_URL: process.env.MOBITEACH_URL ?? 'https://demo.mobiteach.net/',
	MOBITEACH_MOBIAPP_API: (process.env.MOBITEACH_URL ?? 'https://demo.mobiteach.net/') + 'html/mobiApp/',
	SSL_KEY: process.env.SSL_KEY !== '' ? process.env.SSL_KEY : undefined,
	SSL_CERT: process.env.SSL_CERT !== '' ? process.env.SSL_CERT : undefined,
        BASE_URL: process.env.BASE_URL ?? 'https://missions.mobiteach.fr/'
};
