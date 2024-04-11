import multer from 'multer';
import { getFileTypeByExtension, getFileNameFormatted } from '~/utils/file.utils';
import { Router } from 'express';
import { Types } from 'mongoose';
import { UsersService } from '~/resources/users/users.service';
import { MediaService } from '~/resources/media/media.service';
import { NotFoundException } from '~/utils/exceptions';
import { config } from '~/config';
import { extname, join } from 'path';
import fs from 'fs';

// Création d'un Router Express
const MediaController: Router = Router();

// Instanciation du service
const mediaService = new MediaService();
const userService = new UsersService();

/**
 * @swagger
 * tags:
 *  name: Medias
 *  description: Gestion des médias
 *  
 * /medias:
 *  post:
 *   summary: Création d'un média
 *   tags: [Medias]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        file:
 *         type: string
 *         format: binary
 *         description: Fichier à uploader
 *        userId:
 *         type: string
 *         description: ID de l'utilisateur propriétaire du média
 *   responses:
 *    201:
 *     description: Média créé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID du média
 *         name:
 *          type: string
 *          description: Nom du média
 *         type:
 *          type: string
 *          description: Type du média
 *          enum: [image, video, audio]
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur propriétaire du média
 *    500:
 *     description: Erreur serveur
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /medias/user/{id}:
 *  get:
 *   summary: Récupération des médias d'un utilisateur à partir de l'ID passé en paramètre.
 *   tags: [Medias]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de l'utilisateur
 *      required: true
 *   responses:
 *    200:
 *     description: Médias récupérés
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID du média
 *          name:
 *           type: string
 *           description: Nom du média
 *          type:
 *           type: string
 *           description: Type du média
 *           enum: [image, video, audio]
 *          userId:
 *           type: string
 *           description: ID de l'utilisateur propriétaire du média
 *    404: 
 *     description: Utilisateur non trouvé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /medias/{id}:
 *  get:
 *   summary: Récupération d'un média à partir de l'ID passé en paramètre.
 *   tags: [Medias]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID du média
 *      required: true
 *   responses:
 *    200:
 *     description: Média récupéré
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID du média
 *         name:
 *          type: string
 *          description: Nom du média
 *         type:
 *          type: string
 *          description: Type du média
 *          enum: [image, video, audio]
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur propriétaire du média
 *    404:
 *     description: Média non trouvé
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
 *   summary: Suppression d'un média à partir de l'ID passé en paramètre.
 *   tags: [Medias]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID du média
 *      required: true
 *   responses:
 *    200:
 *     description: Média supprimé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    404:
 *     description: Média non trouvé
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
const fileUpload = multer({
	storage: fileStorage
});

MediaController.route('/')
	.post(fileUpload.single('file'), async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.body.userId);
			const user = await userService.find(userId);
			if (!user) {
				console.log('mauvais id user -- media controller')
				throw new NotFoundException('Mauvais ID utilisateur');
			}
			const createdMedia = await mediaService.create(userId, req.body);
			console.log('media créé via media / ', createdMedia);
			return res.status(201).json(createdMedia);
		} catch (err) {
			next(err);
		}
	});

MediaController.route('/user/:userId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			if (!user) {
				throw new NotFoundException('Mauvais ID utilisateur');
			}
	
			const mediaList = await mediaService.findAll(userId);
			return res.status(200).json(mediaList);
		} catch (err) {
			next(err);
		}
	});

MediaController.route('/:mediaId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const mediaId = new Types.ObjectId(req.params.mediaId);
			const media = await mediaService.find(mediaId);

			if (!media) {
				throw new NotFoundException('Media introuvable');
			}
			res.sendFile(join(config.ATTACHEMENT_SRC, media.userId.toString(), media.type + 's', media.name));
		} catch(err) {
			next(err);
		}
	})
	.delete(async (req, res, next) => {
		try {
			const mediaId = new Types.ObjectId(req.params.mediaId);
			const media = await mediaService.find(mediaId);
			
			if (!media) {
				throw new NotFoundException('Media introuvable');
			}
			
			fs.unlinkSync(join(config.ATTACHEMENT_SRC, media.userId.toString(), media.type + 's', media.name));
			await mediaService.delete(mediaId);
			return res.status(200).json();
		} catch (err) {
			next(err);
		}
	});

export default MediaController;
