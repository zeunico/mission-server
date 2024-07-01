import { Router } from 'express';
import { Types, isObjectIdOrHexString } from 'mongoose';

import { NotFoundException } from '~/utils/exceptions';
import { extname, sep } from 'path';
import { config } from '~/config';
import fs, { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { IUser } from '~~/types/users.interface';
import { downloadFile } from '~/utils/file.utils';

import { MediaService } from '../media/media.service';
import { UsersService } from '~/resources/users/users.service';
import { RoomService } from '~/resources/room/room.service';
import { InstanceService} from '~/resources/instance/instance.service';

import EMedia from '~~/types/media.enum';
import { TokenHandler } from '~/middlewares/token.handler';
import axios from 'axios';
import { IRoom } from '~~/types/room.interface';
import { join } from 'path';
import { IInstance } from '~~/types/instance.interface';


// Création d'un Router Express
const UsersController: Router = Router();

// Instanciation du service
const service = new UsersService();
const mediaService = new MediaService();
const roomService = new RoomService();
const instanceService =new InstanceService();

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
 *        instance:
 *         type: string
 *         description: Instance Mobiteach
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
 *         instance:
 *          type: string
 *          description: Nom de l'instance à laquelle l'utilisateur est rattaché
 *         instructions:
 *          type: array
 *          description: Liste des consignes de l'utilisateur
 * 
 * /users/{email}/:
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
 *         connexion:
 *          type: string
 *          description: Id de la salle où est actuellement connecté le participant.
 *         roomId:
 *          type: array
 *          description: Liste des salles où le particiânt s'est cnnecté
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
 * /users/{idUser}/connect/{idRoom}:
 *   put:
 *     summary: Connecte un utilisateur à une salle.
 *     description: Connecte un utilisateur à une salle spécifique en mettant à jour le champ `connexion` de l'utilisateur avec l'ID de la salle.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du participant
 *       - in: path
 *         name: idRoom
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la salle 
 *     responses:
 *       201:
 *         description: Message indiquant que le participant est connecté à la salle avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       200:
 *         description: Message indiquant que le participant est déjà connecté à la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: L'utilisateur ou la salle spécifiée n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur.
 * /users/{idUser}/ismoderator/{idRoom}:
 *   get:
 *     summary: Vérifie si un utilisateur est modérateur d'une salle.
 *     description: Vérifie si l'utilisateur identifié par `idUser` est le modérateur de la salle identifiée par `idRoom`.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'utilisateur (24 caractères hexadécimaux).
 *       - in: path
 *         name: idRoom
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la salle (24 caractères hexadécimaux).
 *     responses:
 *       '200':
 *         description: Retourne un booléen indiquant si l'utilisateur est le modérateur de la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       '404':
 *         description: L'utilisateur ou la salle spécifiée n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Utilisateur introuvable
 *       '500':
 *         description: Erreur interne du serveur.
 * /users/{idUser}/ismoderatorConnect:
 *   get:
 *     summary: Vérifie si l'utilisateur est le modérateur de la salle à laquelle il est connecté.
 *     description: Vérifie si l'utilisateur spécifié par `idUser` est le modérateur de la salle à laquelle il est connecté.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         required: true
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Indique si l'utilisateur est le modérateur de la salle.
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       404:
 *         description: L'utilisateur ou la salle spécifiée n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Utilisateur introuvable ou Salle introuvable
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Erreur interne du serveur.
 * /users/{idUser}/disconnect/{idRoom}:
 *   put:
 *     summary: Déconnecte un utilisateur d'une salle.
 *     tags: [Users]
 *     description: Déconnecte un utilisateur d'une salle spécifique en mettant à jour le champ `connexion` de l'utilisateur à `null`.
 *     parameters:
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du participant
 *       - in: path
 *         name: idRoom
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la salle
 *     responses:
 *       200:
 *         description: Message indiquant que l'utilisateur est déconnecté de la salle avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: L'utilisateur ou la salle spécifiée n'existe pas.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur.
 * /users/listconnect/{idRoom}:
 *   get:
 *     summary: Liste des utilisateurs connectés
 *     tags: [Users]
 *     description: Ce point de terminaison récupère la liste des noms d'utilisateurs connectés à une salle spécifiée, à l'exclusion du modérateur.
 *     parameters:
 *       - in: path
 *         name: idRoom
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{24}$'
 *         description: L'ID de la salle
 *     responses:
 *       200:
 *         description: Une liste de noms d'utilisateurs connectés à la salle spécifiée, à l'exclusion du modérateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - user1
 *                 - user2
 *                 - user3
 *       400:
 *         description: Format de l'ID de la salle invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid room ID format."
 *       404:
 *         description: Salle non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Room not found."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 * /users/nbrconnect/{idRoom}:
 *   get:
 *     summary: Nombre des utilisateurs connectés pour une salle
 *     tags: [Users]
 *     description: Ce point de terminaison récupère le nombre d'utilisateurs connectés à une salle spécifiée, à l'exclusion du modérateur.
 *     parameters:
 *       - in: path
 *         name: idRoom
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{24}$'
 *         description: L'ID de la salle
 *     responses:
 *       200:
 *         description: Le nombre d'utilisateurs connectés à la salle spécifiée, à l'exclusion du modérateur
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               example: 3
 *       404:
 *         description: Salle introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Room not found."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
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

// !!!!!!!!!!!  PORTE D ENTREE !!! 
// !!!!!!!!!!!  PORTE D'ENTRÉE !!! 
UsersController.route('/:email([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-z]{2,3})/')
    .get(async (req, res, next) => {
        try {
            const email = req.params.email;

            let user: IUser | null;
            if (req.query.instance) {
                user = await service.findByEmail(email, req.query.instance.toString());
            } else {
                user = await service.findByEmail(email);
            }

            const roomCode = req.query.roomCode;

            const instanceName = req.query.instance;

            const instance = await instanceService.findByName(instanceName);

            if (!instance) {
                // Créer une instance et une salle si elles n'existent pas
                await instanceService.createInstanceByName(instanceName);
                const newInstance = await instanceService.findByName(instanceName);
                if (newInstance) {
                    const room = await roomService.createNewRoom(roomCode);
                    const roomId = room._id;
                    await instanceService.addRoomToInstance(instanceName.toString(), new Types.ObjectId(roomId));
                } else {
                    throw new Error('Échec de la création ou de la recherche de l\'instance');
                }
            } else {
                // L'instance existe, vérifier et créer la salle si nécessaire
                const room = await roomService.findByCodeAndInstance(roomCode, instanceName);
                if (!room && roomCode) {
                    const room = await roomService.createNewRoom(roomCode);
                    const roomId = room._id;
                    await instanceService.addRoomToInstance(instanceName.toString(), new Types.ObjectId(roomId));
                }
            }

            // S'assurer que la salle est définie pour le traitement ultérieur
            const room = await roomService.findByCodeAndInstance(roomCode, instanceName);

            if (req.query.roomCode) {
                // Effectuer un post axios et gérer la création ou la mise à jour de l'utilisateur
                await axios.post('https://' + req.query.instance + '/html/mobiApp/connect', {
                    'roomCode': req.query.roomCode,
                    'userEmail': email
                }, { headers: { 'mission-token': TokenHandler() } })
                    .then(async (resAxios) => {
                        if (!user) {
                            // Créer l'utilisateur s'il n'est pas trouvé
                            // @ts-ignore
                            user = await service.create({
                                _id: new Types.ObjectId(resAxios.data.user.id),
                                email,
                                firstname: resAxios.data.user.firstname,
                                lastname: resAxios.data.user.lastname,
                                connexion: new Types.ObjectId(room._id),
                                picture: null,
                                instructions: [],
                                instance: req.query.instance !== undefined ? req.query.instance.toString() : config.MOBITEACH_URL,
                                roomId: [room._id],
                            });

                            const isModerator = resAxios.data.user.isModerator;
                            if (isModerator) {
                                // Gérer la logique du modérateur
                                room.moderatorId = user._id;
                                await roomService.update({ moderatorId: user._id }, room._id);
                            } else {
                                // Gérer la logique du participant
                                if (!room.participants.includes(user._id)) {
                                    room.participants.push(user._id);
                                    await roomService.update({ participants: room.participants }, room._id);
                                }
                            }

                            // Gérer l'image de profil de l'utilisateur
                            const userPicture = resAxios.data.user.image;
                            if (userPicture && userPicture !== '') {
                                // Télécharger et enregistrer l'image de l'utilisateur
                                const [file, filename] = await downloadFile(resAxios.data.user.image);
                                // @ts-ignore
                                const media = await mediaService.create(user._id, {
                                    name: user._id + '_profile' + extname(filename),
                                    type: EMedia.IMAGE,
                                });
                                const dest = media.path().split(sep).slice(0, -1).join(sep);
                                if (!existsSync(dest)) {
                                    await mkdir(dest, { recursive: true });
                                }
                                await writeFile(media.path(), file);
                                user = await service.update({ picture: media._id }, user._id);
                            }
                        } else {
                            // Mettre à jour l'utilisateur existant s'il est trouvé
                            if (room && room._id) {
								// Mettre à jour la propriétés connexion	
								await service.update({ connexion: room._id }, user._id);
								// Ajouter la salle à la liste des salles de l'utilisateur
                                if (!user.roomId.includes(room._id)) {
                                    user.roomId.push(room._id);
                                    await service.update({ roomId: user.roomId }, new Types.ObjectId(user._id));
                                }
                            }
                        }
                        const updatedUser = await service.find(user._id);
                        return res.status(200).json(updatedUser);
                    })
                    .catch((err) => {
                        console.log('ERREUR', err);
                        next(err); // Transmettre l'erreur au middleware de gestion des erreurs
                    });
            } else {
                // Gérer le cas où req.query.roomCode n'est pas présent
                if (!user) {
                    throw new NotFoundException('Utilisateur introuvable');
                }
                const updatedUser = await service.find(user._id);
                return res.status(200).json(updatedUser);
            }
        } catch (err) {
            next(err); // Transmettre l'erreur au middleware de gestion des erreurs
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


//// IS MODERATOR SeLON UNE ROOM
UsersController.route('/:idUser([a-z0-9]{24})/ismoderator/:idRoom([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.idUser);
			const roomId = new Types.ObjectId(req.params.idRoom);
		
			const user = await service.find(userId);
			const room = await roomService.findById(roomId);			 

            if (!user) {
                throw new NotFoundException('Utilisateur introuvable');
            }

            if (!room) {
                throw new NotFoundException('Salle introuvable');
            }
			const roomModerator = room.moderatorId;
				
			
			if (roomModerator.equals(userId)) {
				return res.status(200).json(true);

			}
			else {return res.status(200).json(false);
			}

		} catch (err) {
			console.log(err);
			next(err);
		}
	});

	//// IS MODERATOR DE LA SALLE OU LE PARTICIPANT EST CONNECTE
UsersController.route('/:idUser([a-z0-9]{24})/ismoderatorConnect')
.get(async (req, res, next) => {
	try {
		const userId = new Types.ObjectId(req.params.idUser);
		const user = await service.find(userId);
		console.log('ududeu',user);
		const roomId = new Types.ObjectId(user?.connexion);
		const room = await roomService.findById(roomId);
		if (!user) {
			throw new NotFoundException('Utilisateur introuvable');
		}

		if (!room) {
			throw new NotFoundException('Salle introuvable');
		}

		const roomModerator = room.moderatorId;
		console.log('remoodera', roomModerator);
			
		
		if (roomModerator.equals(userId)) {
			return res.status(200).json(true);

		}
		else {return res.status(200).json(false);
		}

	} catch (err) {
		console.log(err);
		next(err);
	}
});

//// SE CONNECTE /////////////// 
UsersController.route('/:idUser([a-z0-9]{24})/connect/:idRoom([a-z0-9]{24})')
	.put(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.idUser);
			const roomId = new Types.ObjectId(req.params.idRoom);
		
			const user = await service.find(userId);
			const room = await roomService.findById(roomId);

			const roomCode = room?.roomCode;

            if (!user) {
                throw new NotFoundException('Utilisateur introuvable');
            }

            if (!room) {
                throw new NotFoundException('Salle introuvable');
            }				
			
			if (room._id.equals(user.connexion)) {
				res.status(200).json('Participant :  ' + user.firstname +'  ' + user.lastname +' est déjà connecté à ' + roomCode +'.');
			} else {
				if (user) {
					user.connexion = new Types.ObjectId(room._id);
					await user.save();
					res.status(201).json('Participant :  '  + user.firstname +'  ' + user.lastname +' est désormais connecté à ' + roomCode +'.');
				}
			} 	

		} catch (err) {
			console.log(err);
			next(err);
		}
	});

	//// SE DECONNECTE /////////////// 
	UsersController.route('/:idUser([a-z0-9]{24})/disconnect/:idRoom([a-z0-9]{24})')
	.put(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.idUser);
			const roomId = new Types.ObjectId(req.params.idRoom);
		
			const user = await service.find(userId);
			const room = await roomService.findById(roomId);

			const roomCode = room?.roomCode;

            if (!user) {
                throw new NotFoundException('Utilisateur introuvable');
            }

            if (!room) {
                throw new NotFoundException('Salle introuvable');
            }
				
			if (!room._id.equals(user.connexion)) {
				res.status(200).json('Participant :  ' + user.firstname +'  ' + user.lastname +' est déjà déconnecté de ' + roomCode +'.');
			} else {
				if (user) {
					user.connexion = null;
					await user.save();
					res.status(200).json('Participant :  ' + user.firstname +'  ' + user.lastname +' est désormais déconnecté à ' + roomCode +'.');
				}
			} 	
		} catch (err) {
			console.log(err);
			next(err);
		}
	});


	
//// LISTE DES UTILISATEURS CONNECTES POUR UNE SALLE
UsersController.route('/listconnect/:idRoom([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const roomId = new Types.ObjectId(req.params.idRoom);
			const room = await roomService.findById(roomId);
			if (room)
				{
					const moderatorId = room?.moderatorId;
					const connectedUsers = await service.findUserNamesConnectedToRoomExcludingModerator(roomId, moderatorId);
					res.status(200).json(connectedUsers);
				}
		} catch (err) {
			console.error(err);
			next(err);
		}
	});

//// NBR DES UTILISATEURS CONNECTES POUR UNE SALLE
UsersController.route('/nbrconnect/:idRoom([a-z0-9]{24})')
    .get(async (req, res, next) => {
        try {
            const roomId = new Types.ObjectId(req.params.idRoom);
            const room = await roomService.findById(roomId);
            if (room) {
                const moderatorId = room?.moderatorId;
                const nbrConnectedUsers = await service.countConnectedUsersExcludingModerator(roomId, moderatorId);
                res.status(200).json(nbrConnectedUsers);
            } else {
                res.status(404).json({ error: "Salle introuvable." });
            }
        } catch (err) {
                console.error(err);
                res.status(500).json({ error: "Internal server error." });
				next(err);
            }

        
    });


export default UsersController;