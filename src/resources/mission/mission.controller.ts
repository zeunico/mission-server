import { Router } from 'express';
import { Types, isObjectIdOrHexString } from 'mongoose';
import { UserDataService } from '../userData/userData.service';
import { MissionService } from '../mission/mission.service';
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
 *           description: Code identifiant de la mission généré par la base de données
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
 * 
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
 *        type: object
 *        properties:
 *         isVisible:
 *          type: boolean
 *          description: Visibilité de la mission
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
 *        type: object
 *        properties:
 *         isVisible:
 *          type: boolean
 *          description: Activité de la mission
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
 *        type: object
 *        properties:
 *         isVisible:
 *          type: boolean
 *          description: Status de la mission (guidée ou pas)
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
				createTestMission();
		}

		try {
            console.log('GET /missions called');
			
		const missionList = await service.findAll();
		console.log('missinList;;', missionList);
		if (missionList.length === 0) {
			return res.status(404).json({ message: 'Aucune mission trouvée' });
		}
		return res.status(200).json(missionList);
	}
	catch (error) {
		console.error('Error in GET /missions:', error);
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
		next(err);
	}
});


// FONCTIONS TEMPORAIRES 

async function createTestMission() {
	const missionData: IMission = {
		_id: new Types.ObjectId(), 
		titre: "Mission Test avec misionsArray",
		roomId: new Types.ObjectId("66571ca5c2fee0607ed11b71"),
		nb_activites: 4,
		etat: "0",
		visible: false,
		active: false,
		guidee: false,
		visuel: "/blabla/uimg.jpg",
	};
	
	try {
		const createdMission = await service.create(missionData);
		console.log('Created Mission:', createdMission);
	} catch (error) {
		console.error('Error creating mission:', error);
	}
	}

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


async function isVisible(mission) {

	const researchedMission = await service.find(mission);
	
	if (researchedMission && (researchedMission.visible === true)) {
		return true;
	} else {
		return false;
	}
	
}

async function isActive(mission) {

	const researchedMission = await service.find(mission);
	
	if (researchedMission && (researchedMission.active === true)) {
		return true;
	} else {
		return false;
	}
	
}

async function isGuidee(mission) {

	const researchedMission = await service.find(mission);
	
	if (researchedMission && (researchedMission.guidee === true)) {
		return true;
	} else {
		return false;
	}
	
}



export default MissionController;