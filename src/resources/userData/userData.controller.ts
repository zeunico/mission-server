import multer from 'multer';
import { Router } from 'express';
import { Types } from 'mongoose';
import { UserDataService } from './userData.service';
import { MediaService } from '../media/media.service';
import { MissionService } from '../mission/mission.service';
import { ThumbService } from '../thumb/thumb.service';
import { RoomService } from '../room/room.service';
import { NotFoundException } from '~/utils/exceptions';
import { extname, join } from 'path';
import { getFileNameFormatted, getFileTypeByExtension } from '~/utils/file.utils';
import { config } from '~/config';
import fs from 'fs';
import { UsersService } from '../users/users.service';
import EMedia from '~~/types/media.enum';
import { IMedia } from '~~/types/media.interface';
import { IThumb } from '~~/types/thumb.interface'; 
import { IMission } from '~~/types/mission.interface'; 

import MThumb from '~/db/thumb.model';
import axios from 'axios';
import { TokenHandler } from '~/middlewares/token.handler';
import { ActivityService } from '../activity/activity.service';
import Mission from '~/db/mission.model';
import Room from '~/db/room.model';


// Création d'un Router Express
const UserDataController: Router = Router();

// Instanciation des services
const service = new UserDataService();
const mediaService = new MediaService();
const userService = new UsersService();
const thumbService = new ThumbService();
const activityService = new ActivityService();
const roomService = new RoomService();
const missionService = new MissionService();



/**
 * @swagger
 * tags:
 *  name: UserData
 *  description: Gestion des réponses utilisateurs
 * 
 * /datas:
 *  post:
 *   summary: Création d'une réponse utilisateur
 *   tags: [UserData]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        userId:
 *         type: string
 *         description: ID de l'utilisateur
 *         required: true
 *        description:
 *         type: string
 *         description: Description de la réponse
 *        file:
 *         type: string
 *         format: binary
 *         description: Fichier à envoyer (photo ou vidéo)
 *         required: false
 *        room: 
 *         type: string
 *         description: RoomCode de la salle
 *   responses:
 *    201:
 *     description: Réponse utilisateur créée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la réponse utilisateur
 *         description:
 *          type: string
 *          description: Description de la réponse utilisateur
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur
 *         mediaId:
 *          type: string
 *          description: ID du média
 *         thumbId:
 *          type: string
 *          description: ID du thumbnail
 *    404:
 *     description: Utilisateur introuvable
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /datas/{id}:
 *  get:
 *   summary: Récupération d'une réponse utilisateur à partir de l'ID passé en paramètre.
 *   tags: [UserData]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de la réponse utilisateur
 *      required: true
 *   responses:
 *    200:
 *     description: Réponse utilisateur trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la réponse utilisateur
 *         description:
 *          type: string
 *          description: Description de la réponse utilisateur
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur
 *         mediaId:
 *          type: string
 *          description: ID du média
 *    404:
 *     description: Réponse utilisateur introuvable
 *     content:
 *      application/json:
 *       schema:
 *        type: object 
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 *  delete:
 *   summary: Suppression d'une réponse utilisateur à partir de l'ID passé en paramètre.
 *   tags: [UserData]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de la réponse utilisateur
 *      required: true
 *   responses: 
 *    200:
 *     description: Réponse utilisateur supprimée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    404:
 *     description: Réponse utilisateur introuvable 
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /datas/{activityId}/{userId}:
 *  get:
 *   summary: Récupération les ressources postées par un modérateur ou les réponses d'un utilisateur pour une activité 
 *   tags: [UserData]
 *   parameters:
 *    - name: activityId
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      type: string
 *    - name: userId
 *      in: path
 *      description: ID de l'utilisateur
 *      required: true
 *      type: string
 *   responses:
 *    200:
 *     description: Réponses utilisateurs trouvées pour l'activité
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de la réponse utilisateur
 *          activityId:
 *           type: string
 *           description: ID de l'activité
 *          mediaId:
 *           type: object
 *           properties:
 *            _id:
 *             type: string
 *             description: ID du média
 *            type:
 *             type: string
 *             description: Type de média (par exemple, "image")
 *          thumbId:
 *           type: string
 *           description: ID de la miniature
 *          description:
 *           type: string
 *           description: Description de la réponse utilisateur
 *          room:
 *           type: string
 *           description: Code de la salle virtuelle
 *          userId:
 *           type: string
 *           description: ID de l'utilisateur
 *          instance:
 *           type: string
 *           description: Instance de l'application
 *          createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la réponse
 *          updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour de la réponse
 *          __v:
 *           type: integer
 *           description: Version du document
 *        example:
 *         _id: "667a907af9f5eb146762ae9b"
 *         activityId: "667a720bd06e40d821e91978"
 *         mediaId:
 *          _id: "667a907af9f5eb146762ae97"
 *          type: "image"
 *         thumbId: "667a907af9f5eb146762ae99"
 *         description: "picto casque"
 *         room: "ADC001"
 *         userId: "6228b3b4d558d809023a8dbb"
 *         instance: "demo.mobiteach.net"
 *         createdAt: "2024-06-25T09:40:10.546Z"
 *         updatedAt: "2024-06-25T09:40:10.546Z"
 *         __v: 0
 *    404:
 *     description: Réponses utilisateurs introuvables pour cette activité
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 */

// Création d'un objet multer Storage
const fileStorage = multer.diskStorage({
	// définit le dossier de destination à partir de l'ID de l'utilisateur
	destination: function(req, file, cb) {
		
		const extension = extname(file.originalname);

		try {
			const folder = getFileTypeByExtension(extension);
			req.body.type = folder;

			const dest = join(config.ATTACHEMENT_SRC, req.body.userId, folder + 's');

			console.log('dest dans userData controller', dest);


			if (!fs.existsSync(dest)) {
				fs.mkdirSync(dest, { recursive: true });
			}

			cb(null, join(dest));
	
		} catch (err) {
			cb((err as Error), '');
		}
	
	},

	filename: function (req, file, cb) {
		const extension = extname(file.originalname);
		try {
			const fileName = getFileNameFormatted(file.originalname, extension);
			req.body.name = fileName;
			cb(null, fileName);
	
		} catch (err) {
			cb((err as Error), '');
		}
	}
});

// Création d'un objet multer
const fileupload = multer({
	storage: fileStorage
});

UserDataController.route('/')
	.post(fileupload.single('file'), async (req, res, next) => {
			
		try {
			console.log('rea.body', req.body);
			
			const userId = new Types.ObjectId(req.body.userId);
			if (!req.body.userId) {
				throw new NotFoundException('ID Utilisateur manquant');
			}
			const user = await userService.find(userId);
			console.log('user', user);
			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			const activityId  = new Types.ObjectId(req.body.activityId);
			if (!req.body.activityId) {
				throw new NotFoundException('ID activité manquante');
			}
			const activity = await activityService.findById(activityId);
			console.log('activityId', activityId);
			if (!activity) {
				throw new NotFoundException('Activité introuvable');
			}

			 
			let room;
            if (!req.body.room) {
                console.log('yep pas de romCode dans la requête');
                const mission = await missionService.findMissionByActivity(req.body.activityId);
                const roomId = mission.roomId;
                room = await roomService.findCodeById(roomId);
            } else {
                room = req.body.room;
            }


			// Traitment du media de la requête
			let media: IMedia | undefined = undefined;
			console.log('ok');
			let thumb: IThumb | undefined = undefined;	
			if (req.file) {
				
				media = await mediaService.create(userId, req.body);
				
				thumb = await thumbService.create(userId, req.body);

				if (!fs.existsSync(thumb.path())) {
					fs.mkdirSync(thumb.path(), { recursive: true });
					console.log('mkdir thumbs created !!');
				}

				const originalFilePath = media.path();
				const outputFilePath = thumb.path() + '/' + thumb.name;

				if (media.type == "image") { 
					
					// Traitement des fichiers images => thumbnail

					(async () => {
						
							const imageThumbnail = require('image-thumbnail');
							try {
								const thumbnail = await imageThumbnail(originalFilePath);
								
								fs.writeFileSync(outputFilePath, thumbnail);
								} catch (err) {
								console.error(err);
							}
					})();
					}
				
					else if (media.type == "video"){

						// Traitement des fichiers videos => thumbnail
		
						// Dossier Cible
						const outputThumbDir = `${thumb.path()}/`;
												
						// fluent-ffmpeg
						const ffmpegStatic = require('ffmpeg-static');
						const ffmpeg = require('fluent-ffmpeg');
						ffmpeg.setFfmpegPath(ffmpegStatic);

						// Pour mise à jour document MongoDB
						const thumbId = thumb?._id; 
						const newName = thumb ? thumb.name + '.png' : ''; // Ajout '.png' au fichier '.mp4'
						
						ffmpeg(originalFilePath)
							.on('filenames', function(filenames: string[]) {
								console.log('Prêt pour  ' + filenames.join(', '))
							})
							.on('end', function() {
								console.log('Screenshots vid ok');

								async function updateThumbName(thumbId: Object, newName: Object) {
									try {
										// Mise à jour du nom du thumb
										const result = await MThumb.updateOne(
										{ _id: thumbId },
										{ $set: { name: newName } }
										);					  
										console.log(`Mise à jour du document MongoDB : ok`);
									} catch (error) {
										console.error('Mise à jour du document MongoDB : une erreur est survenue.', error);
									}
									}					
								updateThumbName(thumbId, newName);
									})
							.screenshots({
								count: 1,
								filename: thumb.name + '.png',
								folder: outputThumbDir
							});
					}
			}

			// const newUserData = await service.createUserData(user, activity._id, media?._id, thumb?._id, req.body, room);
			const newUserData = await service.createUserData(user, activity._id, media?._id, thumb?._id, { ...req.body, room });


			console.log('newuserdata', newUserData);

        	// Connexion Axios à Mobiteach

			axios.post('https://' + user.instance + '/html/mobiApp/data', {
				'roomCode': newUserData.room,
				'userId': newUserData.userId,
				'data': {
					'id': newUserData._id.toString(),
					'type': media?.type ?? EMedia.TEXT,
					'media': newUserData.mediaId?.toString() ?? undefined,
					'description': newUserData.description
				}
			}, { headers: { 'mission-token': TokenHandler() } })
				.catch((err) => {
					console.log(err);
				});
			
			return res.status(201).json(newUserData);
		} catch (err) {
			next(err);
		}

	})
	.delete(async (req, res, next) => {
		try {
			await service.clear();

			return res.status(200).json();
		}
		catch (err) {
			next(err);
		}
	});

	
UserDataController.route('/:id([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const userDataId = new Types.ObjectId(req.params.id);
			const userData = await service.find(userDataId);
			
			if (!userData) {
				throw new NotFoundException('Réponse introuvable');
			}

			return res.status(200).json(userData);
		} catch (err) {
			next(err);
		}
	})
	.delete(async (req, res, next) => {
		try {
			const userDataId = new Types.ObjectId(req.params.id);
			const userData = await service.find(userDataId);

			if (!userData) {
				throw new NotFoundException('Réponse introuvable');
			}

			await axios.delete('https://' + userData.instance + '/html/mobiApp/data/?roomCode=' + userData.room + '&userId=' + userData.userId + '&dataId=' + userDataId, { headers: { 'mission-token': TokenHandler() } })
				.then(async () => {
					try {
						await service.delete(userDataId);
						if (userData.mediaId) {
							await mediaService.delete(userData.mediaId);
							console.log('Media supprimé !');
						}
					} catch (mediaErr) {
						console.log("Erreur à la suppression du media:", mediaErr);
						// Handle the error as needed
					}
				})
				.catch(async (err) => {
					await service.delete(userDataId);
					console.log(err);
				});
			console.log('Réponse supprimée !');
			return res.status(200).json();
		} catch (err) {
			next(err);
		}
	});
// 	!!!!! utilise le roomcode sans verif instance !!! RETIREE DE LA DOC @swagger !! Mal documentée à l origine
UserDataController.route('/:room([a-z0-9]{6})')
	.get(async (req, res, next) => {
		try {
			if (req.params.room !== req.params.room.toUpperCase()) {
				throw new NotFoundException('Room code invalide');
			}

			let dataList;
			if (req.query.instance) {
				dataList = await service.findAll(req.params.room, req.query.instance.toString());
				console.log('dataList', dataList);
			} else {
				dataList = await service.findAll(req.params.room);
			}

			const parsedDataList = dataList.map((data) => {
				return {
					'userId': data.userId,
					'data': {
						'id': data._id,
						'type': data.mediaId?.type ?? EMedia.TEXT,
						'media': data.mediaId?._id,
						'description': data.description
					}
				};
			});
				
			console.log(parsedDataList);

			if (parsedDataList.length !== 0) {
				await axios.post('https://' + req.query.instance + '/html/mobiApp/alldata', {
					'roomCode': req.params.room,
					'alldata': parsedDataList
				} , { headers: { 'mission-token': TokenHandler() } } )
					.catch((err) => {
						console.log(err);
						next(err);
					});
			}
			return res.status(200).json(dataList);
		} catch (err) {
			next(err);
		}
	});
// ROUTE LISTE DES REPONSES PAR ROOM ET UTILISATEUR !!!!! utilise le roomcode sans verif instance !!! RETIREE DE LA DOC @swagger 
UserDataController.route('/:room([a-z0-9]{6})/:userId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			if (req.params.room !== req.params.room.toUpperCase()) {
				throw new NotFoundException('Room code invalide');
			}
			const userId = new Types.ObjectId(req.params.userId);
			console.log('userId',userId);
			console.log('req.params.room',req.params.room);
			const user = await userService.find(userId);
			console.log('user',user);
			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			const dataList = await service.findByUserId(user, req.params.room);
			console.log('dataList',dataList);
			return res.status(200).json(dataList);
		} catch (err) {
			next(err);
		}
	});

// ROUTE LISTE DES REPONSES PAR ROOMCODE, UTILISATEUR ET PAR ACTIVITE !!!!! utilise le roomcode sans verif instance !!! RETIREE DE LA DOC @swagger 
UserDataController.route('/:room([a-z0-9]{6})/:userId([a-z0-9]{24})/:activityId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			if (req.params.room !== req.params.room.toUpperCase()) {
				throw new NotFoundException('Room code invalide');
			}
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);

			const activityId = new Types.ObjectId(req.params.activityId);
			console.log('activityId',activityId);

			console.log('activity._id',activity?._id);
			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			const dataList = await service.findByUserIdAndActivityId(user, req.params.room, req.params.activityId);
			console.log('dataList',dataList);
			return res.status(200).json(dataList);
		} catch (err) {
			next(err);
		}
	});

// ROUTE LISTE DES REPONSES PAR UTILISATEUR ET PAR ACTIVITE
UserDataController.route('/:activityId([a-z0-9]{24})/:userId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			const activityId = new Types.ObjectId(req.params.activityId);
			const activity = await activityService.find(activityId);
			if (!activity) {
				throw new NotFoundException('Activité introuvable');
			}

			const mission = await Mission.find({ activites: activityId });
			console.log('missin', mission);
			if (!mission) {
				throw new NotFoundException('L activité n est dans aucune mission');
				} 
			const roomId = new Types.ObjectId(mission[0].roomId);
			console.log('roomId', roomId);
			const roomCode = await roomService.findCodeById(roomId);
			console.log('roomId', roomCode);
			

			const dataList = await service.findByUserIdAndActivityId(user, roomCode , activityId);
			console.log('dataList',dataList);
			return res.status(200).json(dataList);
			
		} catch (err) {
			next(err);
		}
	});

export default UserDataController;
