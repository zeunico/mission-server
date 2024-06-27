import { Router } from 'express';
import { Types, isObjectIdOrHexString } from 'mongoose';
import { RoomService } from '../room/room.service';
import { InstanceService } from './instance.service';


// Création d'un Router Express
const InstanceController: Router = Router();

// Instanciation des Services

const roomService = new RoomService();
const service = new InstanceService();

/**
 * @swagger
 * tags:
 *  name: Instance
 *  description: Gestion des instances
 * 
 * /instance:
 *  get:
 *   summary: Récupération de la liste des instances
 *   tags: [Instance]
 *   responses:
 *    200:
 *     description: Liste des instances
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de l instance
 *          name:
 *           type: string
 *           description: Nom de l instance
 *          rooms:
 *           type: array
 *           description: Liste des salles présentes dans l instance
 *    404:
 *     description: Aucune instance trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /instance/{id}:
 *  get:
 *   summary: Récupération des informations d'une instance pour son ID
 *   tags: [Instance]
 *   parameters:
 *   - name: id
 *     in: path
 *     required: true
 *     description: L'ID de l instance dont on récupère les informations
 *     type: string
 *   responses:
 *    200:
 *     description: L'instance récupérée selon son ID
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          _id:
 *           type: string
 *           description: Code identifiant de l instance
 *          name:
 *           type: string
 *           description: Nom de l'instance 
 *          rooms:
 *           type: array
 *           description: Liste des salles présentes dans l instance
 *    404:
 *     description: Instance introuvable
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
  * /{instanceName}/{roomCode}/moderator:
 *  get:
 *   summary: Récupération de l'ID du modérateur de la salle selon le roomCode et le nom de l'instance
 *   tags: [Instance]
 *   parameters:
 *    - in: path
 *      name: instanceName
 *      required: true
 *      schema:
 *       type: string
 *      description: Nom de l'instance
 *    - in: path
 *      name: roomCode
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[A-Z0-9]{6}$'
 *      description: Code de la salle (6 caractères alphanumériques)
 *   responses:
 *    200:
 *     description: ID du modérateur de la salle
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        description: ID du modérateur
 *    404:
 *     description: Instance ou salle non trouvée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 *    500:
 *     description: Erreur interne du serveur
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur

 */

// ROUTE RACINE LISTE TOUTES LES SALLES
InstanceController.route('/')
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
InstanceController.route('/:id([a-z0-9]{24})/')
.get(async (req, res, next) => {
	try {
		const id = new Types.ObjectId(req.params.id);
		
		const room = await roomService.findById(id);
	
		return res.status(200).json(room);
	} catch (err) {
		next(err);
	}
});

// ID MODERATOR DE LA SALLE SELON ROOMCODE ET NOM INSTANCE 
InstanceController.route('/:instanceName/:roomCode([A-Z0-9]{6})/moderator')
	.get(async (req, res, next) => {
		try {
			const roomCode = req.params.roomCode;

			const instanceName = req.params.instanceName;
			const instance = await service.findByName(instanceName);
			if (!instance) {
				return res.status(404).json({ error: 'Instance introuvable.' });
			}			
			
			// On récupère la salle par son roomcode et son instance 			
			const room = await roomService.findByCodeAndInstance(roomCode, instanceName);
			if (!room) {
				return res.status(404).json({ error: 'Salle introuvable.' });
			}

		// TO STRING pour comparaison
			const roomId = room._id.toString();

			const roomsInInstance = instance.rooms.map(room => room.toString());

			if (!roomsInInstance.includes(roomId)) {
				return res.status(403).json({ error: 'Aucune salle avec ce code dans cette instance. ' });
			}

			const moderatorId = room.moderatorId.toString();

			return res.status(200).json(moderatorId);

		} catch (err) {
			next(err);
		}
	});

export default InstanceController;