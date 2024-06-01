import { Router } from 'express';
import { Types, isObjectIdOrHexString } from 'mongoose';
import { NotFoundException } from '~/utils/exceptions';
import { MissionService } from '../mission/mission.service';
import { RoomService } from '../room/room.service';
import { IMission } from '~~/types/mission.interface';


// Création d'un Router Express
const MissionController: Router = Router();

// Instanciation des Services

const service = new MissionService();

/**
 * @swagger
 * tags:
 *  name: Mission
 *  description: Gestion des missions
 * 
 * /mission:
 *  get:
 *   summary: Récupération de la liste des missions
 *   tags: [Mission]
 *   responses:
 *    200:
 *     description: Liste des missions
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: Code identifiant (ID) de la mission
 *          titre:
 *           type: string
 *           description: Titre de la mission
 *          nb_activites:
 *           type: number
 *           description: Nombre d activites dans cette mission
 *          etat:
 *           type: string
 *           description: Etat de la mission (non_demarree, en_cours ou terminee)
 *          visible :
 *           type: boolean
 *           description: Visibilité de la mission
 *          active :
 *           type: boolean
 *           description: Activité de la mission
 *          guidee :
 *           type: boolean
 *           description: Mission Guidee
 *          visuel :
 *           type: string
 *           description: Visuel
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
 *  post:
 *   summary: Création d'une mission
 *   tags: [Mission]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        _id:
 *         type: string
 *         description: Code identifiant (ID) de la mission
 *        titre:
 *         type: string
 *         description: Titre de la mission
 *        roomId:
 *         type: string
 *         description: ID de la salle 
 *        nb_activites:
 *         type: number
 *         description: Nombre d'activités de la mission
 *        etat:
 *         type: string
 *         description: Etat de la mission (non démarrée / en cours / terminée)
 *        visible:
 *         type: boolean
 *         description: Visibilié de la mission
 *        active:  
 *         type: boolean
 *         description: La mission est-elle active ?
 *        guidee:
 *         type: boolean
 *         description: La mission est-elle guidée ?
 *        visuel: 
 *         type: String,
 *         description: Visuel accompagnant la mission.
 *   responses:
 *    201:
 *     description: Mission créée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la mission
 *         titre:
 *          type: string
 *          description: Titre de la mission
 *         roomId:
 *          type: string
 *          description: ID de la salle 
 *         nb_activites:
 *          type: number
 *          description: Nombre d'activités de la mission
 *         etat:
 *          type: string
 *          description: Etat de la mission (non démarrée / en cours / terminée)
 *         visible:
 *          type: boolean
 *          description: Visibilié de la mission
 *         active:  
 *          type: boolean
 *          description: La mission est-elle active ?
 *         guidee:
 *          type: boolean
 *          description: La mission est-elle guidée ?
 *         visuel: 
 *          type: String,
 *          description: Visuel accompagnant la mission.
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
 * /mission/{id}:
 *  get:
 *   summary: Récupère une mission enregistrée en base de données à partir de son ID passé en paramètre.
 *   tags: [Mission]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: Code identifiant de la mission généré par la base de données
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: La mission enregistrée en base de données à partir de son ID passé en paramètre.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: Code identifiant de la mission généré par la base de données
 *         titre:
 *          type: string
 *          description: Titre de la mission
 *         nb_activites:
 *          type: number
 *          description: Nombre d activites dans cette mission
 *         etat:
 *          type: string
 *          description: Etat de la mission (non_demarree, en_cours ou terminee)
 *         visible :
 *          type: boolean
 *          description: Visibilité de la mission
 *         active :
 *          type: boolean
 *          description: Activité de la mission
 *         guidee :
 *          type: boolean
 *          description: Mission Guidee
 *         visuel :
 *          type: string
 *          description: Visuel
 *    404:
 *     description: La mission n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * 
 * 
 * /mission/{id}/isVisible:
 *  get:
 *   summary: Vérifie si une mission est visible.
 *   tags: [Mission]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de la mission dont on vérifie la visibilité
 *      type: string
 *   responses:
 *    200:
 *     description: Status de visibilité d la mission.
 *     content:
 *      application/json:
 *       schema:
 *        type: boolean
 *        example: false 
 *        description: Visibilité de la mission
 *    404:
 *     description: La mission n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur 
 * 
 * /mission/{id}/change-to-visible:
 *   post:
 *     summary: Changer la visibilité de la mission à visible
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état de visibilité d'une mission en visible.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de la mission
 *     responses:
 *       200:
 *         description: La mission est déjà active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est déjà active
 *       201:
 *         description: La mission est maintenant active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est désormais active
 *       400:
 *         description: Le champ ID est manquant
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Le champ ID est manquant.
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Erreur interne du serveur
 * /mission/{id}/isActive:
 *  get:
 *   summary: Vérifie si une mission est active.
 *   tags: [Mission]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de la mission dont on vérifie le statut d'activité
 *      type: string
 *   responses:
 *    200:
 *     description: Status de l'activité d la mission.
 *     content:
 *      application/json:
 *       schema:
 *        type: boolean
 *        example: false 
 *        description: Status de la mission (active ou pas)
 *    404:
 *     description: La mission n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * 
 * /mission/{id}/isGuidee:
 *  get:
 *   summary: Vérifie si une mission est guidée.
 *   tags: [Mission]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de la mission dont on vérifie le statut guidée ou pas
 *      type: string
 *   responses:
 *    200:
 *     description: Status de la mission (guidée ou pas)
 *     content:
 *      application/json:
 *       schema:
 *        type: boolean
 *        example: false
 *        description: Status de la mission (guidée ou pas)
 *    404:
 *     description: La mission n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur 
 * 
 */

/**    
 * Chemin: URI SERVER + /mission/
 * Ce lien fournit la liste des missions enregistrées en base de données, toutes salles confondues.
 */


// ROUTE RACINE LISTE TOUTES LES MISSIONS
MissionController.route('/')
	.get(async (req, res) => {
		if ((await service.findAll()).length === 0) {
			const missionData: IMission = {
				_id: new Types.ObjectId(), 
				titre: "Mission Test avec misionsArray",
				nb_activites: 4,
				etat: "0",
				visible: false,
				active: false,
				guidee: false,
				visuel: "/blabla/uimg.jpg",
			};
			const roomId = new Types.ObjectId("665b33caeff613234dc9535e");
			const createdMission = await MissionService.createMission(new Types.ObjectId(roomId), missionData);
			const room = await RoomService.findById(roomId);
			room?.mission.push(missionData._id);	
			await RoomService.update(room, roomId);
			console.log('Created Mission:', createdMission);
		}
		try {
			const missionList = await service.findAll();
			console.log('missionList;', missionList);
			if (missionList.length === 0) {
				return res.status(404).json({ message: 'Aucune mission trouvée' });
			}
			return res.status(200).json(missionList);
		}
		catch (error) {
			console.error('Error in GET /missions:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	})
	.post(async (req, res, next) => {
		try {
			console.log('req.body', req.body);
			if (!req.body || Object.keys(req.body).length === 0) {
				return res.status(400).json({ message: 'Votre requête est vide.' });
			}
			else {
				const mission = await MissionService.createMission(req.body.roomId, req.body);
				const room = await RoomService.findById(req.body.roomId);
				const roomId = new Types.ObjectId(req.body.roomId);
				room.mission.push(mission._id);	
				await RoomService.update(room, roomId);
				return res.status(201).json(mission);
			}	
		}		
		catch (error) {
			console.error('Error in POST /missions:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});

// ROUTE RACINE MISSION PAR SON ID
MissionController.route('/:id([a-z0-9]{24})/')
	.get(async (req, res, next) => {
		try {
			const id = new Types.ObjectId(req.params.id);
			const mission = await service.find(id);	
			return res.status(200).json(mission);
		} catch (err) {
			console.error('Error in POST /missions/id:');
			next(err);
		}
	});






// ROUTES ET FONCTIONS POUR STATUS VISIBLE, ACTIVE et GUIDEE 
MissionController.route('/:id([a-z0-9]{24})/isVisible/')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);

            const isVisibleStatus = await isVisible(id);
			return res.status(200).json(isVisibleStatus);
				
		}
		catch (error) {
			console.error('Error in GET /missions/{id}/isVisible:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});

MissionController.route('/:id([a-z0-9]{24})/change-to-visible/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
	
		try {
			const  statusVisible = await service.findVisibilityStatus(new Types.ObjectId(id));
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			if (statusVisible) {
				res.status(200).json('Mission :  ' + titre + ' est déjà active');
			} else {
				if (mission) {mission.visible = true;
				await mission.save();
				res.status(201).json('Mission :  ' + titre + ' est désormais active');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
		}
	});

MissionController.route('/:id([a-z0-9]{24})/isActive/')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);

            const isActiveStatus = await isActive(id);
			return res.status(200).json(isActiveStatus);
				
		}
		catch (error) {
			console.error('Error in GET /missions/{id}/isActive:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});

MissionController.route('/:id([a-z0-9]{24})/isGuidee/')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);

            const isGuideeStatus = await isGuidee(id);
			return res.status(200).json(isGuideeStatus);
				
		}
		catch (error) {
			console.error('Error in GET /missions/{id}/isGuidee:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});


function isVisible(mission) {

	const researchedMission =  service.find(mission);
	
	if (researchedMission && (researchedMission.visible === true)) {
		return true;
	} else {
		return false;
	}
	
}

function isActive(mission) {

	const researchedMission = service.find(mission);
	
	if (researchedMission && (researchedMission.active === true)) {
		return true;
	} else {
		return false;
	}
	
}

function isGuidee(mission) {

	const researchedMission = service.find(mission);
	
	if (researchedMission && (researchedMission.guidee === true)) {
		return true;
	} else {
		return false;
	}
	
}



export default MissionController;