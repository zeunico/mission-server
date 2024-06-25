import { Router } from 'express';
import { UsersService } from '~/resources/users/users.service';
import { MediaService } from '../media/media.service';
import { UserDataService } from '../userData/userData.service';
import { IUserData } from '~~/types/userData.interface';
import { IMedia } from '~~/types/media.interface';
import { Types } from 'mongoose';

// Création d'un Router Express
const MoodleController: Router = Router();

// Instanciation des Services
const userService = new UsersService();
const mediaService = new MediaService();
const userDataService = new UserDataService();

/**
 * @swagger
 * tags:
 *  name: Moodle
 *  description: Interrogation des tables Users, Media et UserData pour l'utilisation MOODLE
 * 
 * /moodle/users:
 *  get:
 *   summary: Récupération de la liste des utilisateurs
 *   tags: [Moodle]
 *   responses:
 *    200:
 *     description: Liste des utilisateurs
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: Code identifiant de l'utilisateur généré par la base de données
 *          email:
 *           type: string
 *           description: Adresse email de l'utilisateur
 *          name:
 *           type: string
 *           description: Prénom et Nom de l'utilisateur
 *          picture:
 *           type: string
 *           description: URL de l'image de profil de l'utilisateur
 *          instance:
 *           type: string
 *           description: Nom de l'instance à laquelle l'utilisateur est rattaché
 *   404:
 *    description: Aucun utilisateur trouvé
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *         description: Message d'erreur
 * 
 * /moodle/medias:
 *  get:
 *   summary: Récupération de la liste des médias
 *   tags: [Moodle]
 *   responses:
 *    200:
 *     description: Liste des médias
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            description: ID du média
 *           name:
 *            type: string
 *            description: Nom du média
 *           type:
 *            type: string
 *            description: Type du média
 *            enum: [image, video, audio]
 *           userId:
 *            type: string
 *            description: ID de l'utilisateur propriétaire du média
 *    404:
 *     description: Aucun média trouvé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /moodle/userDatas:
 *  get:
 *   summary: Récupération de la liste des réponses
 *   tags: [Moodle]
 *   responses:
 *    200:
 *     description: Liste des réponses
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            description: ID de la réponse utilisateur
 *           description:
 *            type: string
 *            description: Description de la réponse utilisateur
 *           userId:
 *            type: string
 *            description: ID de l'utilisateur
 *           mediaId:
 *            type: string
 *            description: ID du média
 *    404:
 *     description: Aucune réponse trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /moodle/userDatas/{instance}:
 *  get:
 *   summary: Récupération de la liste des réponses d'une instance	
 *   tags: [Moodle]
 *   parameters:
 *    - name: instance
 *      in: path
 *      description: Nom de l'instance
 *      required: true
 *   responses:
 *    200:
 *     description: Liste des réponses
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *           description: Nom de l'utilisateur propriétaire de la réponse
 *          room:
 *           type: string
 *           description: Code de la salle virtuelle
 *          picture:
 *           type: string
 *           description: URL de l'image de profil de l'utilisateur
 *          description:
 *           type: string
 *           description: Description de la réponse
 *          answer:
 *           type: object
 *           description: Média de la réponse si le média a été fournit
 *           properties:
 *            _id:
 *             type: string
 *             description: ID du média
 *            type:
 *             type: string
 *             description: Type du média
 *             enum: [image, video, audio]
 *    404:
 *     description: Aucune réponse trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 */

/**    
 * Chemin: URI SERVER + /moodle/users
 * Ce lien fournit la liste des utilisateurs enregistrés en base de données, toutes instances et salles confondues.
 */
MoodleController.route('/users')
	.get(async (req, res) => {
		const userList = await userService.findAll();
		const parsedList: { _id: Types.ObjectId; email: string; name: string; picture: string; instance: string; }[] = [];
		if (userList.length === 0) return res.status(404).json({ message: 'moodle/users Pas de données participants dans cette instance' });

		userList.forEach((user) => {
			parsedList.push({
				_id: user._id,
				email: user.email,
				name: user.firstname + ' ' + user.lastname,
				picture: 'https://missions.mobiteach.fr/medias/' + user.picture,
				instance: user.instance,
			});
		});

		return res.status(200).json(parsedList);
	});


/**
 * Chemin: http://missions.mobiteach.fr/moodle/medias
 * Ce lien fournit, pour chaque utilisateurs, la liste des médias (images de profils incluses) enregistrés en base de données, toutes instances et salles confondues.
 */
MoodleController.route('/medias')
	.get(async(req, res) => {
		const userList = await userService.findAll();
		const mediaList = [];
		
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < userList.length; i++) {
			mediaList.push(await mediaService.findByUserId(userList[i]._id));
		}

		if (mediaList.length === 0) return res.status(404).json({ message: 'Pas de media dans cette instance' });

		return res.status(200).json(mediaList);
	});


/**
 * Chemin: https://mission.mobiteach.fr/moodle/userDatas
 * Ce lien fournit, pour chaque utilisateurs, la liste des réponses enregistrées en base de données, toutes instances et salles confondues.
 */
MoodleController.route('/userDatas')
	.get(async(req, res) => {
		const userList = await userService.findAll();
		const userDataList = [];

		
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < userList.length; i++) {
			userDataList.push(await userDataService.findByUserId(userList[i]));
		}
		
		if (userDataList.length === 0) return res.status(404).json({ message: 'Aucun participant ne s\'est connecté à  cette instance' });

		return res.status(200).json(userDataList);
	});

MoodleController.route('/userDatas/:instance([a-zA-Z0-9]+.mobiteach.net)')
	.get(async(req, res) => {
		const userList = await userService.findByInstance(req.params.instance);
		const userDataList: { name: string; room: string; picture: string; answer: Pick<IMedia, 'type'>; description: string; }[] = [];

		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < userList.length; i++) {
			const userData = await userDataService.findByUserId(userList[i]);
			userData.forEach((data: (Omit<IUserData, 'mediaId'> & { mediaId: Pick<IMedia, 'type'> })) => {
				console.log('DATA: ', data.mediaId);
				userDataList.push({
					name: userList[i].firstname + ' ' + userList[i].lastname,
					room: data.room,
					picture: 'https://missions.mobiteach.fr/users/' + userList[i]._id + '/image',
					answer: data.mediaId,
					description: data.description
				});
				
			});
		}

		return res.status(200).json(userDataList);
	});

export default MoodleController;
