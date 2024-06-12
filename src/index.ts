import { config } from '~/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import MediaController from '~/resources/media/media.controller';
import ThumbController from '~/resources/thumb/thumb.controller';
import UsersController from '~/resources/users/users.controller';
import UserDataController from '~/resources/userData/userData.controller';
import InstructionController from '~/resources/instruction/instruction.controller';
import MoodleController from '~/resources/moodle/moodle.controller';
import MissionController from '~/resources/mission/mission.controller';
import RoomController from '~/resources/room/room.controller';
import { ExceptionsHandler } from '~/middlewares/exceptions.handler';
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import ActivityController from './resources/activity/activity.controller';

// const cronJobs = require('./cronJobs'); 

// Création d'une nouvelle instance express
const app = express();

// Création d'un serveur http
const httpServer = http.createServer(app);

// Swagger
const swaggerOptions = {
	definition: {
		openapi: '3.1.0',
		info: {
			title: 'MOBITEACH - Knowledge Hubs - MISSIONS',
			version: '0.1.0',
			description: 'Un projet DIGITAL LEARNING innovant pour assurer un continuum d\'apprentissage avec les sessions formelles de formation !',
		},
		servers: [
			{
				url: config.BASE_URL,
				description: 'Server',
			},
		],
	},
	tryItOutEnabled: false,
	apis: ['**/*.controller.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);

// On dit à express de parser le body des requêtes en JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// On dit à express d'utiliser cors
app.use(cors({
	// allow all subdomains of mobiteach.net
	origin: new RegExp('^(https?://)?([a-z0-9]+[.])*mobiteach[.]net$')
}));

// Routes CRUD pour les utilisateurs seront préfixées par '/users'
app.use('/users', UsersController);

// Route CRUD des médias
app.use('/medias', MediaController);

// Route CRUD des thumbs
app.use('/thumb', ThumbController);

// Route CRUD des réponses
app.use('/datas', UserDataController);

// Route CRUD des instructions
app.use('/instructions', InstructionController);

// Route CRUD pour l'interface MISSION
app.use('/mission', MissionController);

// Route CRUD pour l'interface MISSION
app.use('/activity', ActivityController);

// Route CRUD pour l'interface ROOM
app.use('/room', RoomController);

// Route CRUD pour l'interface MOODLE
app.use('/moodle', MoodleController);

app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(specs, { customCss: '.swagger-ui .topbar { display: none } .try-out { display: none }', customSiteTitle: 'MISSIONS HUB DOCS', customfavIcon: 'https://missions.mobiteach.fr/mobi.ico' }));

// Homepage
app.use('/', express.static(__dirname + '/../public', { dotfiles: 'allow' }));

// pour les autres routes, on renvoie une erreur 404
app.all('*', UnknownRoutesHandler);

// Gestion des erreurs
app.use(ExceptionsHandler);

// set charset on UTF-8
app.use((req, res, next) => {
	req.acceptsCharsets('utf-8');
	res.charset = 'utf-8';
	next();
});

// On demande à express d'écouter les requetes sur le port défini dans la config
const start = async () => {
	try {
		httpServer.listen(config.API_PORT);
		console.log('HTTP server is listening on port : ' + config.API_PORT);
		mongoose.connect(config.DB_URI);

		httpServer.on('error', (err: Error) => {
			throw err;
		});

		process.on('SIGINT', () => {
			httpServer.close();
		});

		httpServer.on('close', async () => {
			await mongoose.disconnect();
			console.log('Server closed');
		});

		if (config.SSL_KEY && config.SSL_CERT) {
			const options = {
				key: readFileSync(config.SSL_KEY),
				cert: readFileSync(config.SSL_CERT)
			};

			const httpsServer = https.createServer(options, app);
			httpsServer.listen(443);
			console.log('HTTPS server is listening on port : 443');

			httpsServer.on('error', (err: Error) => {
				throw err;
			});

			process.on('SIGINT', () => {
				httpsServer.close();
			});

			httpsServer.on('close', async () => {
				httpServer.close();
			});
		}
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();

