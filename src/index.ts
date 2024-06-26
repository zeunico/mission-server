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
import InstanceController from '~/resources/instance/instance.controller';

import { ExceptionsHandler } from '~/middlewares/exceptions.handler';
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import ActivityController from './resources/activity/activity.controller';
import { MissionService } from './resources/mission/mission.service';
import { RoomService } from './resources/room/room.service';
import { ActivityService } from './resources/activity/activity.service';



// new MisionService et new ActivityService pour routines inscriptions 
const missionService = new MissionService();
const activityService = new ActivityService();
const roomService = new RoomService();


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

// Route CRUD pour l'interface ACTIVITY
app.use('/activity', ActivityController);

// Route CRUD pour l'interface ROOM
app.use('/room', RoomController);

// Route CRUD pour l'interface INSTANCE
app.use('/instance', InstanceController);

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

// LES ROUTINES D INSCRIPTION AUX MISSIONS ET ACTIVITES


const addConnectedUsersToMission = async () => {
    try {
        const rooms = await roomService.findAll();
        for (const room of rooms) {

            await missionService.insrireParticipantsRoomToMissions(room._id);
        }
    } catch (error) {
        console.error('Erreur lors de l ajout des participants aux missions :', error);
    }
};


// Routine pour ajouter les users connectés aux activités des missions de leur(s) room(s)
const addConnectedUsersToActivities = async () => {
    try {
		// Toutes les salles
		const rooms = await roomService.findAll();
		for (const room of rooms) {

			// Toutes les missions dans la salle
			const missions = await missionService.findByRoomId(room._id);
			for (const mission of missions) {

				const activityList = mission?.activites;
				for (const activity of activityList)
					{
						const activityId = activity._id;
						await activityService.inscrireParticipantsToActivity(activityId, room._id);
					}	 
				}
			}
    } catch (error) {
        console.error('Erreur lors de l ajout des participants aux activités :', error);
    }
};

// Fréquence des inscriptions, constantes objects Intervalles pour le "clear" au shutdown du server 
const missionIntervalId = setInterval(() => addConnectedUsersToMission(), 5000);
const activityIntervalId = setInterval(() => addConnectedUsersToActivities(), 5000);


// On demande à express d'écouter les requetes sur le port défini dans la config
const start = async () => {
	try {


		// PAS DE SSL KEY et CERT
		if (!(config.SSL_KEY && config.SSL_CERT)) {

			httpServer.listen(config.API_PORT);
			console.log('MISSION HTTP server à l\'écoute sur : ' + config.API_PORT);
			mongoose.connect(config.DB_URI);

			httpServer.on('error', (err: Error) => {
				throw err;
			});

			process.on('SIGINT', () => {
				httpServer.close();
			});

			httpServer.on('close', async () => {
				// On clear les missionIntervalId et activityIntervalId après le SIGINT pour interrompre les routines d'inscription
				clearInterval(missionIntervalId);
				clearInterval(activityIntervalId);
				// Déconnexion Mongo
				await mongoose.disconnect();
				console.log('Server closed');
			});
		}


		// AVEC SSL KEY et CERT // INUTILE ACTUELLEMENT CAR APP DERRIERE PROXY CONFIGURE

		if (config.SSL_KEY && config.SSL_CERT) {
				const options = {
					key: readFileSync(config.SSL_KEY),
					cert: readFileSync(config.SSL_CERT)
				};

				const httpsServer = https.createServer(options, app);
				httpsServer.listen(443);
				console.log('HTTPS (avec key et cert) server is listening on port : 443');
				
				mongoose.connect(config.DB_URI);

				httpsServer.on('error', (err: Error) => {
					throw err;
				});

				process.on('SIGINT', () => {
					httpsServer.close();
				});

				httpsServer.on('close', async () => {
					clearInterval(missionIntervalId);
					clearInterval(activityIntervalId);
					httpsServer.close();
				});
			}
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();

