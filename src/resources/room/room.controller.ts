import { Router } from 'express';
import { Types, isObjectIdOrHexString } from 'mongoose';
import { UserDataService } from '../userData/userData.service';
import { RoomService } from '../room/room.service';
import { IRoom } from '~~/types/room.interface';


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
 *           description: Code identifiant de la salle généré par la base de données
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
 *
 * /room/{id}:
 *  get:
 *   summary: Récupération d'une salle pour son ID
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
 *           description: Code identifiant de la salle généré par la base de données
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
 *  
 */

// ROUTE RACINE LISTE TOUTES LES SALLES
RoomController.route('/')
	.get(async (req, res) => {



		try {
           
		const roomList = await RoomService.findAll();
	
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
		
		const room = await RoomService.findById(id);
	
		return res.status(200).json(room);
	} catch (err) {
		next(err);
	}
});





export default RoomController;