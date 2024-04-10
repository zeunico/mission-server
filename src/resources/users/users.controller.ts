import { Router } from 'express';
import { Types } from 'mongoose';
import { UsersService } from '~/resources/users/users.service';
import { NotFoundException } from '~/utils/exceptions';
import { extname, join, sep } from 'path';
import { config } from '~/config';
import fs, { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { IUser } from '~~/types/users.interface';
import { downloadFile } from '~/utils/file.utils';
import { MediaService } from '../media/media.service';
import EMedia from '~~/types/media.enum';
import { TokenHandler } from '~/middlewares/token.handler';
import axios from 'axios';

// Création d'un Router Express
const UsersController: Router = Router();

// Instanciation du service
const service = new UsersService();
const mediaService = new MediaService();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Gestion des Utilisateurs
 * 
 * /users:
 *  get:
 *   summary: Récupère la liste des utilisateurs enregistrés en base de données, toutes instances et salles confondues.
 *   tags: [Users]
 *   responses:
 *    200:
 *     description: La liste des utilisateurs enregistrés en base de données, toutes instances et salles confondues.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         users:
 *          type: array
 *          items: 
 *           type: object
 *           properties:
 *            _id:
 *             type: string
 *             description: Code identifiant de l'utilisateur généré par la base de données
 *            email:
 *             type: string
 *             description: Adresse email de l'utilisateur
 *            firstname:
 *             type: string
 *             description: Prénom de l'utilisateur
 *            lastname:
 *             type: string
 *             description: Nom de l'utilisateur
 *            picture:
 *             type: string
 *             description: URL de l'image de profil de l'utilisateur
 *            instance:
 *             type: string
 *             description: Nom de l'instance à laquelle l'utilisateur est rattaché
 *            instructions:
 *             type: array
 *             description: Liste des consignes de l'utilisateur
 *    500:
 *     description: Cette ressource n'existe pas.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * 
 *  post:
 *   summary: Crée un nouvel utilisateur en base de données.
 *   tags: [Users]
 *   requestBody:
 *    description: Les informations de l'utilisateur à créer.
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: Adresse email de l'utilisateur
 *        firstname:
 *         type: string
 *         description: Prénom de l'utilisateur
 *        lastname:
 *         type: string
 *         description: Nom de l'utilisateur
 *   responses:
 *    201:
 *     description: Created
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: Code identifiant de l'utilisateur généré par la base de données
 *         email:
 *          type: string
 *          description: Adresse email de l'utilisateur
 *         firstname:
 *          type: string
 *          description: Prénom de l'utilisateur
 *         lastname:
 *          type: string
 *          description: Nom de l'utilisateur
 *         picture:
 *          type: string
 *          description: URL de l'image de profil de l'utilisateur
 *         instance:
 *          type: string
 *          description: Nom de l'instance à laquelle l'utilisateur est rattaché
 *         instructions:
 *          type: array
 *          description: Liste des consignes de l'utilisateur
 * 
 * /users/{email}:
 *  get:
 *   summary: Récupère un utilisateur enregistré en base de données à partir de l'adresse email passée en paramètre.
 *   tags: [Users]
 *   parameters:
 *    - name: email
 *      in: path
 *      description: Adresse email de l'utilisateur
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: L'utilisateur enregistré en base de données à partir de l'adresse email passée en paramètre.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: Code identifiant de l'utilisateur généré par la base de données
 *         email:
 *          type: string
 *          description: Adresse email de l'utilisateur
 *         firstname:
 *          type: string
 *          description: Prénom de l'utilisateur
 *         lastname:
 *          type: string
 *          description: Nom de l'utilisateur
 *         picture:
 *          type: string
 *          description: URL de l'image de profil de l'utilisateur
 *         instance:
 *          type: string
 *          description: Nom de l'instance à laquelle l'utilisateur est rattaché
 *         instructions:
 *          type: array
 *          description: Liste des consignes de l'utilisateur
 *    404:
 *     description: L'utilisateur n'a pas été trouvé en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * 
 * /users/{id}:
 *  get:
 *   summary: Récupère un utilisateur enregistré en base de données à partir du code identifiant passé en paramètre.
 *   tags: [Users]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: Code identifiant de l'utilisateur généré par la base de données
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: L'utilisateur enregistré en base de données à partir du code identifiant passé en paramètre.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: Code identifiant de l'utilisateur généré par la base de données
 *         email:
 *          type: string
 *          description: Adresse email de l'utilisateur
 *         firstname:
 *          type: string
 *          description: Prénom de l'utilisateur
 *         lastname:
 *          type: string
 *          description: Nom de l'utilisateur
 *         picture:
 *          type: string
 *          description: URL de l'image de profil de l'utilisateur
 *         instance:
 *          type: string
 *          description: Nom de l'instance à laquelle l'utilisateur est rattaché
 *         instructions:
 *          type: array
 *          description: Liste des consignes de l'utilisateur
 *    404:
 *     description: L'utilisateur n'a pas été trouvé en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * 
 *  delete:
 *   summary: Supprime un utilisateur enregistré en base de données à partir du code identifiant passé en paramètre.
 *   tags: [Users]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: Code identifiant de l'utilisateur généré par la base de données
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: L'utilisateur enregistré en base de données à partir du code identifiant passé en paramètre.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *    404:
 *     description: L'utilisateur n'a pas été trouvé en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * 
 * /users/{id}/image:
 *  get:
 *   summary: Récupère l'image de profil d'un utilisateur enregistré en base de données à partir du code identifiant passé en paramètre.
 *   tags: [Users]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: Code identifiant de l'utilisateur généré par la base de données
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: L'image de profil de l'utilisateur enregistré en base de données à partir du code identifiant passé en paramètre.
 *     content:
 *      image/png:
 *       schema:
 *        type: string
 *        format: binary
 *        description: Image de profil de l'utilisateur
 *    404:
 *     description: L'utilisateur n'a pas été trouvé en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 */
UsersController.route('/')
	.get(async (req, res) => {
		const userList = await service.findAll();
		return res.status(200).json(userList);
	})
	.post(async (req, res) => {
		const createdUser = await service.create(req.body);
		return res.status(201).json(createdUser);
	});



UsersController.route('/:email([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-z]{2,3})')
	.get(async (req, res, next) => {
		try {
			const email = req.params.email;

			let user: IUser | null;
			if (req.query.instance) {
				user = await service.findByEmail(email, req.query.instance.toString());
			} else {
				user = await service.findByEmail(email);
			}
			
			if (req.query.roomCode) {
				await axios.post('https://' + req.query.instance + '/html/mobiApp/connect', {
					'roomCode': req.query.roomCode,
					'userEmail': email
				}, { headers: { 'mission-token': TokenHandler() } })
					.then(async (resAxios) => {
						if (!user) {
							user = await service.create({
								_id: new Types.ObjectId(resAxios.data.user.id),
								email,
								firstname: resAxios.data.user.firstname,
								lastname: resAxios.data.user.lastname, 
								picture: null,
								instructions: [],
								instance: req.query.instance !== undefined ? req.query.instance.toString() : config.MOBITEACH_URL
							});

							const userPicture = resAxios.data.user.image;

							if (userPicture && userPicture !== '') {
								// On télécharge l'image
								const [file, filename] = await downloadFile(resAxios.data.user.image);

								// On créé le document media associé
								// @ts-ignore
								const media = await mediaService.create(user._id, {
									name: user._id + '_profile' + extname(filename),
									type: EMedia.IMAGE,
								});

								const dest = media.path().split(sep).slice(0, -1).join(sep);
								if (!existsSync(dest)) {
									await mkdir(dest, { recursive: true });
								}
								// On écrit sur le systeme le fichier
								await writeFile(media.path(), file);

								// On met à jour l'utilisateur
								user = await service.update({ picture: media._id }, user._id);
							}
						}
						console.log(' YAY    USER');
						console.log(user);
					})
					.catch((err) => {
						console.log('ERROR');	
						console.log(err);
					});
			} else if (!user) {
				// Ce n'est pas l'utilisateur que vous recherchez
				throw new NotFoundException('Utilisateur introuvable');
			}

			return res.status(200).json(user);
		} catch (err) {
			next(err);
		}
	});

UsersController.route('/:id([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const id = new Types.ObjectId(req.params.id);
			
			const user = await service.find(id);
			
			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			} else if (req.query.roomCode) {
				await axios.post('https://' + user.instance + '/html/mobiApp/disconnect', {
					'roomCode': req.query.roomCode,
					'userId': id
				}, { headers: { 'mission-token': TokenHandler() } })
					.catch((err) => {
						console.log(err);
					});
			}
			

			
			return res.status(200).json(user);
		} catch (err) {
			next(err);
		}
	})
	.put(async (req, res) => {
		const id = new Types.ObjectId(req.params.id);
	
		const userData = req.body;
		
		const updatedUser = await service.update(userData, id);
		
		return res.status(200).json(updatedUser);
	})
	.delete(async (req, res, next) => {
		try {

			const id = new Types.ObjectId(req.params.id);
			const user = await service.find(id);

			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			if (user.picture && user.picture !== null) {
				await mediaService.delete(user.picture);
			}
			
			if (fs.existsSync(join(config.ATTACHEMENT_SRC, id.toString()))) {
				fs.rm(join(config.ATTACHEMENT_SRC, id.toString()), {recursive: true}, (err) => {
					if (err) {
						throw err;
					}});
			}
			const deletedUser = await service.delete(id);
			
			return res.status(200).json(deletedUser);
		} catch (err) {
			next(err);
		}
	});

UsersController.route('/:id([a-z0-9]{24})/image')
	.get(async (req, res, next) => {
		try {
			const id = new Types.ObjectId(req.params.id);
		
			const path = await service.findUserImage(id);
			
			return res.sendFile(path);
		} catch (err) {
			console.log(err);
			next(err);
		}
	});

export default UsersController;
