import multer from 'multer';
import { Router } from 'express';
import { Types } from 'mongoose';
import { UserDataService } from './userData.service';
import { MediaService } from '../media/media.service';
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
import MThumb from '~/db/thumb.model';
import axios from 'axios';
import { TokenHandler } from '~/middlewares/token.handler';
import { ActivityService } from '../activity/activity.service';

// Création d'un Router Express
const UserDataController: Router = Router();

// Instanciation des services
const userDataService = new UserDataService();
const mediaService = new MediaService();
const userService = new UsersService();
const thumbService = new ThumbService();
const activityService = new ActivityService();
const roomService = new RoomService();


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
 * 
 * /datas/{room}/{instance}:
 *  get:
 *   summary: Récupération des réponses utilisateurs d'une salle à partir du code de la salle virtuelle passé en paramètre.
 *   tags: [UserData]
 *   parameters:
 *    - name: room
 *      in: path
 *      description: code de la salle virtuelle
 *      required: true
 *    - name: instance
 *      in: path
 *      description: Nom de l'instance Mobiteach
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"  
 *   responses:
 *    200:
 *     description: Réponses utilisateurs trouvées
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
 *          description:
 *           type: string
 *           description: Description de la réponse utilisateur
 *          userId:
 *           type: string
 *           description: ID de l'utilisateur
 *          mediaId:
 *           type: string
 *           description: ID du média
 *    404:
 *     description: Réponses utilisateurs introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 *
 * /datas/{room}/{userId}:
 *  get:
 *   summary: Récupération des réponses utilisateurs d'une salle à partir du code de la salle virtuelle et de l'ID de l'utilisateur passés en paramètres.
 *   tags: [UserData]
 *   parameters:
 *    - name: room
 *      in: path
 *      description: Code de la salle virtuelle
 *      required: true
 *      type: string
 *    - name: userId
 *      in: path
 *      description: ID de l'utilisateur
 *      required: true
 *      type: string
 *   responses:
 *    200:
 *     description: Réponses utilisateurs trouvées
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
 *          description:
 *           type: string
 *           description: Description de la réponse utilisateur
 *          userId:
 *           type: string
 *           description: ID de l'utilisateur
 *          mediaId:
 *           type: string
 *           description: ID du média
 *    404:
 *     description: Réponses utilisateurs introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /datas/{room}/{userId}/{activityId}:
 *  get:
 *   summary: Récupération des réponses d'un utilisateur pour une activité
 *   tags: [UserData]
 *   parameters:
 *    - name: room
 *      in: path
 *      description: Code de la salle virtuelle
 *      required: true
 *      type: string
 *    - name: userId
 *      in: path
 *      description: ID de l'utilisateur
 *      required: true
 *      type: string
 *    - name: activityId
 *      in: path
 *      description: ID de l'actvité
 *      required: true
 *      type: string
 *   responses:
 *    200:
 *     description: Réponses utilisateurs trouvées pour l'&ctivité
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
 *          description:
 *           type: string
 *           description: Description de la réponse utilisateur
 *          userId:
 *           type: string
 *           description: ID de l'utilisateur
 *          mediaId:
 *           type: string
 *           description: ID du média
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
			console.log('activity', activity);


			const room = await roomService.findByCode(req.body.room);
			console.log('room', room);
			if (!room) {
				throw new NotFoundException('Salle introuvable');
			}
			
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

			const newUserData = await userDataService.createUserData(user, activity._id, media?._id, thumb?._id, req.body);
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
			await userDataService.clear();

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
			const userData = await userDataService.find(userDataId);
			
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
			const userData = await userDataService.find(userDataId);

			if (!userData) {
				throw new NotFoundException('Réponse introuvable');
			}

			await axios.delete('https://' + userData.instance + '/html/mobiApp/data/?roomCode=' + userData.room + '&userId=' + userData.userId + '&dataId=' + userDataId, { headers: { 'mission-token': TokenHandler() } })
				.then(async () => {
					try {
						await userDataService.delete(userDataId);
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
					await userDataService.delete(userDataId);
					console.log(err);
				});
			console.log('Réponse supprimée !');
			return res.status(200).json();
		} catch (err) {
			next(err);
		}
	});
	
UserDataController.route('/:room([a-z0-9]{6})')
	.get(async (req, res, next) => {
		try {
			if (req.params.room !== req.params.room.toUpperCase()) {
				throw new NotFoundException('Room code invalide');
			}

			let dataList;
			if (req.query.instance) {
				dataList = await userDataService.findAll(req.params.room, req.query.instance.toString());
				console.log('dataList', dataList);
			} else {
				dataList = await userDataService.findAll(req.params.room);
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
// ROUTE LISTE DES REPONSES PAR ROOM ET UTILISATEUR
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

			const dataList = await userDataService.findByUserId(user, req.params.room);
			console.log('dataList',dataList);
			return res.status(200).json(dataList);
		} catch (err) {
			next(err);
		}
	});

// ROUTE LISTE DES REPONSES PAR ROOM, UTILISATEUR ET PAR ACTIVITE
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
			const activity = await activityService.find(activityId);
			console.log('activity',activity);
			console.log('activity._id',activity?._id);
			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			const dataList = await userDataService.findByUserIdAndActivityId(user, req.params.room, req.params.activityId);
			console.log('dataList',dataList);
			return res.status(200).json(dataList);
		} catch (err) {
			next(err);
		}
	});

export default UserDataController;
