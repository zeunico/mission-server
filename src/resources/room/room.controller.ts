import { Router } from 'express';
import { Types, isObjectIdOrHexString } from 'mongoose';
import { UserDataService } from '../userData/userData.service';
import { RoomService } from '../room/room.service';
import { IRoom } from '~~/types/room.interface';
import { MissionService } from '../mission/mission.service';


// Création d'un Router Express
const RoomController: Router = Router();

// Instanciation des Services

const service = new RoomService();

/**
 * @swagger
 * tags:
 *  name: Room
 *  description: Gestion des salles
 * 
 * /room:
 *  get:
 *   summary: Récupération de la liste des salles
 *   tags: [Room]
 *   responses:
 *    200:
 *     description: Liste des salles
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de la salle généré par la base de données
 *          roomCode:
 *           type: string
 *           description: Roomcode de la salle
 *          moderatorId:
 *           type: string
 *           description: L'ID de l'animateur (moderator) de la salle
 *          mission:
 *           type: array
 *           description: Liste des missions présentes dans la salle
 *    404:
 *     description: Aucune salle trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /room/{id}:
 *  get:
 *   summary: Récupération des informations d'une salle pour son ID
 *   tags: [Room]
 *   parameters:
 *   - name: id
 *     in: path
 *     required: true
 *     description: L'ID de la mission dont on récupère les informations
 *     type: string
 *   responses:
 *    200:
 *     description: La salle récupérée par son ID
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de la salle
 *          roomCode:
 *           type: string
 *           description: Nom de code de la salle
 *          moderatorId:
 *           type: string
 *           description: L'ID de l'animateur (moderator) de la salle
 *          mission:
 *           type: array
 *           description: Liste des missions présentes dans la salle
 * 
 *    404:
 *     description: Salle introuvable
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /room/{id}/moderator:
 *  get:
 *   summary: Récupération de l'ID du moderator de la salle par l'ID de la salle
 *   tags: [Room]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de la salle
 *      type: string
 *   responses:
 *    200:
 *     description: ID du moderator de la salle
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        items:
 *         type: object
 *         properties:
 *         _id:
 *           type: string
 *           description: ID du moderator de la salle
 *    404:
 *     description: Aucune salle trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /room/{roomCode}/moderator:
 *  get:
 *   summary: Récupération de l'ID du moderator de la salle par le roomCode de la salle (MOBI01 par exemple) 
 *   tags: [Room]
 *   parameters:
 *    - name: roomcode
 *      in: path
 *      required: true
 *      description: Le roomcode de la salle.
 *      type: string
 *   responses:
 *    200:
 *     description: ID du moderator de la salle
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        items:
 *         type: object
 *         properties:
 *         _id:
 *           type: string
 *           description: ID du moderator de la salle
 *    404:
 *     description: Aucune salle trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /room/{id}/participants:
 *  get:
 *   summary:  Récupération de la liste des ID des participants de la salle par l'ID de la salle
 *   tags: [Room]
 *   parameters:
 *   - name: id
 *     in: path
 *     required: true
 *     description: L'ID de la salle
 *     type: string
 *   responses:
 *    200:
 *     description: Liste des ID des participants dans la salle 181
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: string
 *         properties:
 *           type: string
 *           description: Liste des ID des participants dans la salle 190
 *     404:
 *      description: Aucune participant trouvée
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /room/{roomCode}/participants:
 *  get:
 *   summary: Récupération de la liste des ID des participants de la salle par le RoomCode de la salle
 *   tags: [Room]
 *   parameters:
 *   - name: roomcode
 *     in: path
 *     required: true
 *     description: Le roomcode de la salle
 *     type: string
 *   responses:
 *    200:
 *     description: Liste des ID des participants dans la salle 213
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: string
 *         properties:
 *           type: string
 *           description: Liste des ID des participants dans la salle 221
 *    404:
 *     description: Aucun participant trouvé
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
  * /room/{id}/missions:
 *  get:
 *   summary:  Récupération de la liste des ID des missions de la salle par l'ID de la salle
 *   tags: [Room]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de la salle
 *      type: string
 *   responses:
 *    200:
 *     description: Liste des ID des missions de la salle
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: string
 *         properties:
 *           type: string
 *           description: Liste des ID des missions dans la salle
 *    404:
 *     description: Aucune mission trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /room/{roomCode}/missions:
 *  get:
 *   summary: Récupération de la liste des ID des participants de la salle par le RoomCode de la salle
 *   tags: [Room]
 *   parameters:
 *    - name: roomcode
 *      in: path
 *      required: true
 *      description: Le roomcode de la salle
 *      type: string
 *   responses:
 *    200:
 *     description: Liste des ID des missions de la salle
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: string
 *         properties:
 *           type: string
 *           description: Liste des ID des missions dans la salle
 *    404:
 *     description: Aucune mission trouvé
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 */

// ROUTE RACINE LISTE TOUTES LES SALLES
RoomController.route('/')
	.get(async (req, res) => {
		try {
           
		const roomList = await roomService.findAll();
	
		if (roomList.length === 0) {
			return res.status(404).json({ message: 'Aucune salle trouvée' });
		}
		return res.status(200).json(roomList);
	}
	catch (error) {
		console.error('Error in GET /room:', error);
		return res.status(500).json({ message: 'Erreur du serveur' });
	}

});

// ROUTE SALLE SELON SON ID 
RoomController.route('/:id([a-z0-9]{24})/')
.get(async (req, res, next) => {
	try {
		const id = new Types.ObjectId(req.params.id);
		
		const room = await service.findById(id);
	
		return res.status(200).json(room);
	} catch (err) {
		next(err);
	}
});

// ID MODERATOR DE LA SALLE SELON ID DE SALLE
RoomController.route('/:id([a-z0-9]{24})/moderator')
	.get(async (req, res, next) => {
		try {
			const id = new Types.ObjectId(req.params.id);
			
			const room =  await service.findById(id);
			const moderator = room?.moderatorId;
		
			return res.status(200).json(moderator);
		} catch (err) {
			next(err);
		}
	});

// ID MODERATOR DE LA SALLE SELON ROOMCODE DE LA SALLE 
// REMPLACEE PAR /instance/{instanceName}/{roomCode}/moderator
// RoomController.route('/:roomCode([A-Z0-9]{6})/moderator')
// 	.get(async (req, res, next) => {
// 		try {
// 			const roomCode = req.params.roomCode;
// 			const room =  await service.findByCode(roomCode);
// 			const moderator = room?.moderatorId;
// 			return res.status(200).json(moderator);
// 		} catch (err) {
// 			next(err);
// 		}
// 	});

// LISTE DES PARTICIPANTS DE LA SALLE SELON ID DE SALLE
RoomController.route('/:id([a-z0-9]{24})/participants')
	.get(async (req, res, next) => {
		try {
			const id = new Types.ObjectId(req.params.id);
			
			const room =  await service.findById(id);
			const participantsList = room?.participants;
			return res.status(200).json(participantsList);
		} catch (err) {
			next(err);
		}
	});
	
// LISTE DES PARTICIPANTS DE LA SALLE SELON ROOMCODE DE LA SALLE
	/// ATTENTION findByCode  NE FCTINNE QUE POUR UNE INSTANCE UNIQUE

RoomController.route('/:roomCode([A-Z0-9]{6})/participants')
	.get(async (req, res, next) => {
		try {
			const roomCode = req.params.roomCode;
			const room =  await service.findByCode(roomCode);
			const participantsList = room?.participants;
			return res.status(200).json(participantsList);
		} catch (err) {
			next(err);
		}
	});

// LISTE DES MISSIONS DE LA SALLE SELON ID DE SALLE
RoomController.route('/:id([a-z0-9]{24})/missions')
	.get(async (req, res, next) => {
		try {
			const id = new Types.ObjectId(req.params.id);
			
			const room =  await service.findById(id);
			const missionsList = room?.mission;
			return res.status(200).json(missionsList);
		} catch (err) {
			next(err);
		}
	});
	
// LISTE DES MISSIONS DE LA SALLE SELON ROOMCODE DE LA SALLE
	/// ATTENTION findByCode  NE FCTINNE QUE POUR UNE INSTANCE UNIQUE

RoomController.route('/:roomCode([A-Z0-9]{6})/missions')
	.get(async (req, res, next) => {
		try {
			const roomCode = req.params.roomCode;
			const room =  await service.findByCode(roomCode);
			const missionsList = room?.mission;
			return res.status(200).json(missionsList);
		} catch (err) {
			next(err);
		}
	});

export default RoomController;