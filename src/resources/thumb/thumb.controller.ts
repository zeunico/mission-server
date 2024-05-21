import multer from 'multer';
import { Router } from 'express';
import { Types } from 'mongoose';
import { ThumbService } from './thumb.service';
import { UsersService } from '~/resources/users/users.service';
import { NotFoundException } from '~/utils/exceptions';
import { extname, join } from 'path';
import { getFileNameFormatted, getFileTypeByExtension } from '~/utils/file.utils';
import { config } from '~/config';
import fs from 'fs';


// Création d'un Router Express
const ThumbController: Router = Router();

// Instanciation des services
const thumbService = new ThumbService();
const userService = new UsersService();


/**
 * @swagger
 * tags:
 *  name: Thumbs
 *  description: Gestion des thumbs
 *  
 * /thumbs:
 *  post:
 *   summary: Création d'un thumb
 *   tags: [Thumbs]
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
 *         description: ID de l'utilisateur propriétaire du thumb
 *   responses:
 *    201:
 *     description: Thumb créé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID du thumb
 *         name:
 *          type: string
 *          description: Nom du thumb
 *         type:
 *          type: string
 *          description: Type du thumb
 *          enum: [image, video]
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur propriétaire du thumb
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
 * /thumbs/user/{id}:
 *  get:
 *   summary: Récupération des thumbs d'un utilisateur à partir de l'ID passé en paramètre.
 *   tags: [Thumbs]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de l'utilisateur
 *      required: true
 *   responses:
 *    200:
 *     description: Thumbs récupérés
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID du thumb
 *          name:
 *           type: string
 *           description: Nom du média associé
 *          type:
 *           type: string
 *           description: Type du média associé
 *           enum: [image, video]
 *          userId:
 *           type: string
 *           description: ID de l'utilisateur propriétaire du média associé
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
 * /thumbs/{id}:
 *  get:
 *   summary: Récupération d'un thumb à partir de l'ID passé en paramètre.
 *   tags: [Thumbs]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID du thumb
 *      required: true
 *   responses:
 *    200:
 *     description: Thumb récupéré
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID du thumb
 *         name:
 *          type: string
 *          description: Nom du média associé
 *         type:
 *          type: string
 *          description: Type du média associé
 *          enum: [image, video, audio]
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur propriétaire du média associé
 *    404:
 *     description: Thumb non trouvé
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
 *   summary: Suppression d'un Thumb à partir de l'ID passé en paramètre.
 *   tags: [Thumbs]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID du thumb
 *      required: true
 *   responses:
 *    200:
 *     description: Thumb supprimé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    404:
 *     description: Thumb non trouvé
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
		

		try {
			
			const dest = join(config.ATTACHEMENT_SRC, req.body.userId, 'thumbs');
			if (!fs.existsSync(dest)) {
				fs.mkdirSync(dest, { recursive: true });
			}
			cb(null, join(dest));
		} catch (err) {
			cb((err as Error), '');
		}
	
	},

	filename: function (req, file, cb) {
		const extension = "zaza";
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

ThumbController.route('/')
		.post(fileUpload.single('file'), async (req, res, next) => {
		try {
			console.log('ADC');
			const userId = new Types.ObjectId(req.body.userId);
			const user = await userService.find(userId);
			if (!user) {
				throw new NotFoundException('Mauvais ID utilisateur');
			}
						const createdThumb = await thumbService.create(userId, req.body);
			return res.status(201).json(createdThumb);
			
		} catch (err) {
			next(err);
		}
	});

ThumbController.route('/user/:userId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			if (!user) {
				throw new NotFoundException('Mauvais ID utilisateur');
			}
	
			const thumbList = await thumbService.findAll(userId);
			return res.status(200).json(thumbList);
		} catch (err) {
			next(err);
		}
	});

ThumbController.route('/:thumbId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const thumbId = new Types.ObjectId(req.params.thumbId);
			const thumb = await thumbService.find(thumbId);

			if (!thumb) {
				throw new NotFoundException('Thumb introuvable');
			}
			res.sendFile(join(config.ATTACHEMENT_SRC, thumb.userId.toString(), 'thumbs', thumb.name));
		} catch(err) {
			next(err);
		}
	});
	
export default ThumbController;