import { Router } from 'express';
import { Types } from 'mongoose';
import { IActivity, IActivityConsulter, IActivityProduire } from '~~/types/activity.interface';
import { ActivityService, ActivityConsulterService, ActivityProduireService } from '../activity/activity.service';
import { getFileTypeByExtension, getFileNameFormatted } from '~/utils/file.utils';
import { extname, join } from 'path';
import fs from 'fs';
import multer from 'multer';
import { config } from '~/config';
import { ReadableStreamBYOBRequest } from 'stream/web';
import { MissionService } from '../mission/mission.service';
import Mission from '~/db/mission.model';
import Activity from '~/db/activity.model';
import { UsersService } from '../users/users.service';
import EEtat from '~~/types/etat.enum';
import { RoomService } from '../room/room.service';



// Instanciation des Services

const service = new ActivityService();
const missionService = new MissionService();
const userService = new UsersService();
const roomService = new RoomService();


// Création d'un objet multer Storage
const fileStorage = multer.diskStorage({
	// définit le dossier de destination à partir de l'ID de l'utilisateur
	destination: function(req, file, cb) {
		
		const extension = extname(file.originalname);

		try {
			const folder = getFileTypeByExtension(extension);
            console.log('extension', extension);
            console.log('folder', folder);

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


const ActivityController: Router = Router();

const activityService = new ActivityService();

/**
 * @swagger
 * tags:
 *  name: Activity
 *  description: Gestion des activités
 * 
 * /activity:
 *  get:
 *   summary: Liste de toutes les activités
 *   tags: [Activity]
 *   responses:
 *    200:
 *     description: Toutes les activités 
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de l'activité
 *          titre:
 *           type: string
 *           description: Titre de l'activité
 *          etat:
 *           type: array
 *           description: Etat (non commencée / en cours / terminée)
 *          visible:
 *           type: string
 *           description: Visibilité de l'activité
 *          active:
 *           type: string
 *           description: Statut Actif de l'activité
 *          guidée:
 *           type: string
 *           description: Statut Guidée de l'activité
 *          description_detaillee_consulter:
 *           type: string
 *           description: Description détaillée de l'activité
 *          type:
 *           type: string
 *           description: Type de fichier acceptés dans l'activité
 *    404:
 *     description: Activités introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 *  post:
 *   summary: Création d'une activité
 *   tags: [Activity]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        titre:
 *         type: string
 *         description: Titre de la nouvelle activité
 *        description:
 *         type: string
 *         description: Description de l'activité
 *        etat:
 *         type: array
 *         description: Etats d'avancement de l'activité pour chacun des participants
 *        visible:
 *         type: string
 *         description: Statut de visibilité de l'activité
 *        active:
 *         type: string
 *         description: Statut Actif de l'activité
 *        guidée:
 *         type: string
 *         description: Statut Guidée de l'activité
 *        description_detaillee_consulter:
 *         type: string
 *         description: Description détaillée de l'activité
 *        type:
 *         type: string
 *         description: Type de fichier acceptés dans l'activité
 *   responses:
 *    201:
 *     description: Activité créée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de la nouvelle activité
 *         description:
 *          type: string
 *          description: Description de l'activité
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité
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

 * /activity/produire:
 *  get:
 *   summary: Liste de toutes les activités de type PRODUIRE
 *   tags: [Activity]
 *   responses:
 *    200:
 *     description: Toutes les activités de type Produire
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de l'activité Produire
 *          titre:
 *           type: string
 *           description: Titre de l'activité Produire
 *          etat:
 *           type: array
 *           description: Etat d'avancement des participants dans l'activité Produire (non commencée / en cours / terminée)
 *          visible:
 *           type: string
 *           description: Visibilité de l'activité Produire
 *          active:
 *           type: string
 *           description: Statut Actif de l'activité Produire
 *          guidée:
 *           type: string
 *           description: Statut Guidée de l'activité Produire
 *          description_detaillee_produire:
 *           type: string
 *           description: Description détaillée de l'activité Produire
 *          types:
 *           type: array
 *           description: Type de fichier acceptés dans l'activité Produire
 *    404:
 *     description: Activités "Produire" introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 *  post:
 *   summary: Création d'une activité Produire
 *   tags: [Activity]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        titre:
 *         type: string
 *         description: Titre de la nouvelle activité Produire
 *        description:
 *         type: string
 *         description: Description de l'activité
 *        etat:
 *         type: array
 *         description: Etats d'avancement de l'activité pour chacun des participants
 *        visible:
 *         type: string
 *         description: Statut de visibilité de l'activité
 *        active:
 *         type: string
 *         description: Statut Actif de l'activité
 *        guidée:
 *         type: string
 *         description: Statut Guidée de l'activité
 *        description_detaillee_consulter:
 *         type: string
 *         description: Description détaillée de l'activité
 *        types:
 *         type: array
 *         description: Type de fichier acceptés dans l'activité Produire
 *   responses:
 *    201:
 *     description: Activité Produire créée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de la nouvelle activité Produire
 *         description:
 *          type: string
 *          description: Description de l'activité Produire
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité
 *         description_detaillee_produire:
 *          type: string
 *          description: Description détaillée de l'activité Produire
 *         types:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité Produire
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
 * /activity/consulter:
 *  get:
 *   summary: Liste de toutes les activités de type CONSULTER
 *   tags: [Activity]
 *   responses:
 *    200:
 *     description: Toutes les activités de type Consulter
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de l'activité Consulter
 *          titre:
 *           type: string
 *           description: Titre de l'activité Consulter
 *          etat:
 *           type: array
 *           description: Etat d'avancement des particiapants dans l'activité Consulter (non commencée / en cours / terminée)
 *          visible:
 *           type: string
 *           description: Visibilité de l'activité
 *          active:
 *           type: string
 *           description: Statut Actif de l'activité
 *          guidée:
 *           type: string
 *           description: Statut Guidée de l'activité
 *          description_detaillee_consulter:
 *           type: string
 *           description: Description détaillée de l'activité
 *          type:
 *           type: string
 *           description: Type de fichier acceptés dans l'activité
 *    404:
 *     description: Activités "Produire" introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 *  post:
 *   summary: Création d'une activité CONSULTER
 *   tags: [Activity]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        titre:
 *         type: string
 *         description: Titre de la nouvelle activité Consulter
 *        description:
 *         type: string
 *         description: Description de l'activité Consulter
 *        etat:
 *         type: array
 *         description: Etats d'avancement de l'activité Consulter pour chacun des participants
 *        visible:
 *         type: string
 *         description: Statut de visibilité de l'activité Consulter
 *        active:
 *         type: string
 *         description: Statut Actif de l'activité Consulter
 *        guidée:
 *         type: string
 *         description: Statut Guidée de l'activité Consulter
 *        description_detaillee_consulter:
 *         type: string
 *         description: Description détaillée de l'activité Consulter
 *        types:
 *         type: array
 *         description: Type de fichier acceptés dans l'activité Consulter
 *   responses:
 *    201:
 *     description: Activité Consulter créée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité Consulter
 *         titre:
 *          type: string
 *          description: Titre de la nouvelle activité Consulter
 *         description:
 *          type: string
 *          description: Description de l'activité Consulter
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité Consulter pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité Consulter
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité Consulter
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité Consulter
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité Consulter
 *         types:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité Consulter
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
 * /activity/{id}:
 *  get:
 *   summary: Récupère une activité à partir de son ID.
 *   tags: [Activity]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de l'activité
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: L'activité trouvée avec succès.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de la activité
 *         description:
 *          type: string
 *          description: Description de l'activité Consulter ou Produire
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité Consulter ou Produire pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité Consulter ou Produire
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité Consulter ou Produire
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité Consulter ou Produire
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité Consulter ou Produire
 *         types:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité Consulter ou Produire
 *    404:
 *     description: L'activité n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 *  delete:
 *   summary: Supprime une activité à partir de son ID passé en paramètre.
 *   tags: [Activity]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de l'activité
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: L'activité supprimée avec succès.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de la activité
 *         description:
 *          type: string
 *          description: Description de l'activité Consulter ou Produire
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité Consulter ou Produire pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité Consulter ou Produire
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité Consulter ou Produire
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité Consulter ou Produire
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité Consulter ou Produire
 *         types:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité Consulter ou Produire
 * /activity/{idActivity}/{idUser}:
 *   get:
 *     summary: Récupère une activité avec l'état de l'utilisateur
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: idActivity
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-z0-9]{24}$"
 *         description: L'ID de l'activité
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-z0-9]{24}$"
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: L'activité avec l'état de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID de l'activité
 *                   example: "667296bc1d9a23a22c9254f8"
 *                 titre:
 *                   type: string
 *                   description: Le titre de l'activité
 *                   example: "Mercredi"
 *                 description:
 *                   type: string
 *                   description: La description de l'activité
 *                   example: "Ceci est une description"
 *                 description_detaillee_produire:
 *                   type: string
 *                   description: La description détaillée pour produire
 *                   example: "Détails de l'activité production"
 *                 types:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les fichiers media acceptés dans les réponses de l'activité
 *                   example: ["audio", "video"]
 *                 etat:
 *                   type: string
 *                   description: L'état de l'utilisateur dans l'activité
 *                   example: "NON_DEMARREE"
 *                 visible:
 *                   type: boolean
 *                   description: Visibilité de l'activité
 *                   example: false
 *                 active:
 *                   type: boolean
 *                   description: Si l'activité est active
 *                   example: false
 *                 guidee:
 *                   type: boolean
 *                   description: Si l'activité est guidée
 *                   example: false
 *                 __t:
 *                   type: string
 *                   description: Type discriminant
 *                   example: "Activity"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de création de l'activité
 *                   example: "2024-06-19T08:28:44.719Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de mise à jour de l'activité
 *                   example: "2024-06-19T08:30:09.859Z"
 *                 __v:
 *                   type: integer
 *                   description: Version du document
 *                   example: 0
 *       404:
 *         description: Participant ou activité introuvable
 *       500:
 *         description: Erreur interne du serveur
 * /activity/addToMission/{idActivity}/{idMission}:
 *  post:
 *   summary: Ajoute une mission à une activité en utilisant leurs IDs.
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    200:
 *     description: La mission a été ajoutée avec succès à l'activité.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la mission
 *         activites:
 *          type: array
 *          items:
 *            type: string
 *          description: Liste des IDs des activités associées à la mission
 *         nb_activites:
 *          type: integer
 *          description: Nombre total d'activités dans la mission
 *    404:
 *     description: Activité ou mission non trouvée.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur indiquant que l'activité ou la mission n'a pas été trouvée.
 *    409:
 *     description: Conflit. L'activité est déjà présente dans la mission.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant que l'activité est déjà présente dans la mission.
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
 *  delete:
 *   summary: Supprime une mission d'une activité en utilisant leurs IDs.
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    200:
 *     description: L'activité a été retirée de la mission avec succès.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message indiquant que l'activité a été retirée de la mission.
 *    404:
 *     description: Activité ou mission non trouvée.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur indiquant que l'activité ou la mission n'a pas été trouvée.
 *    409:
 *     description: Conflit. L'activité n'est pas présente dans la mission.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant que l'activité n'est pas présente dans la mission.
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
 * /activity/duplicate/{idActivity}:
 *  post:
 *   summary: Duplique une activité en utilisant son ID.
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité à dupliquer
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    200:
 *     description: L'activité a été dupliquée avec succès.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la nouvelle activité dupliquée
 *         titre:
 *          type: string
 *          description: Titre de la nouvelle activité dupliquée
 *         description:
 *          type: string
 *          description: Description de la nouvelle activité dupliquée
 *         etat:
 *          type: array
 *          description: Etats d'avancement de la nouvelle activité dupliquée
 *          items:
 *            type: string
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité Consulter (si applicable)
 *         description_detaillee_produire:
 *          type: string
 *          description: Description détaillée de l'activité Produire (si applicable)
 *         active:
 *          type: string
 *          description: Statut Actif de la nouvelle activité dupliquée
 *         guidee:
 *          type: string
 *          description: Statut Guidée de la nouvelle activité dupliquée
 *         visible:
 *          type: string
 *          description: Statut de visibilité de la nouvelle activité dupliquée
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans la nouvelle activité dupliquée (pour Consulter)
 *         types:
 *          type: string
 *          description: Type de fichier acceptés dans la nouvelle activité dupliquée (pour Produire)
 *    404:
 *     description: Activité non trouvée.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur indiquant que l'activité n'a pas été trouvée.
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
  * /activity/{id}/isVisible:
 *  get:
 *   summary: Vérifie si une activité est visible.
 *   tags: [Activity]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de l'activité dont on vérifie la visibilité
 *      type: string
 *   responses:
 *    200:
 *     description: Status de visibilité de l'activité.
 *     content:
 *      application/json:
 *       schema:
 *        type: boolean
 *        example: false 
 *        description: Visibilité de l'activité
 *    404:
 *     description: L'activité n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur 
 * 
 * /activity/{id}/change-to-visible:
 *   post:
 *     summary: Changer la visibilité de l'activité à visible
 *     tags: [Activity]
 *     description: Ce point de terminaison change l'état de visibilité d'une activité en visible.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de l'activité
 *     responses:
 *       200:
 *         description: L'ctivité est déjà visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est déjà visible
 *       201:
 *         description: La activité est maintenant visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est désormais visible
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
* /activity/{id}/change-to-not-visible:
 *   post:
 *     summary: Changer la visibilité de l'activité à non visible
 *     tags: [Activity]
 *     description: Ce point de terminaison change l'état de visibilité d'une activité en non visible.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de l'activité
 *     responses:
 *       200:
 *         description: L'activité est déjà non visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est déjà non visible
 *       201:
 *         description: L'activité est maintenant non visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est désormais non visible
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
 * /activity/{id}/isActive:
 *  get:
 *   summary: Vérifie si une activité est active.
 *   tags: [Activity]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de l'activité dont on vérifie le statut d'activité
 *      type: string
 *   responses:
 *    200:
 *     description: Status de l'activité d la activité.
 *     content:
 *      application/json:
 *       schema:
 *        type: boolean
 *        example: false 
 *        description: Status de la activité (active ou pas)
 *    404:
 *     description: L'activité n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * /activity/{id}/change-to-active:
 *   post:
 *     summary: Changer la statut Actif de l'activité à visible
 *     tags: [Activity]
 *     description: Ce point de terminaison change l'état de l'activité d'une activity en active.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de l'activité
 *     responses:
 *       200:
 *         description: L'activité est déjà active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est déjà active
 *       201:
 *         description: L'activité est maintenant active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est désormais active
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
 * /activity/{id}/change-to-not-active:
 *   post:
 *     summary: Changer la visibilité de l'activité à non active
 *     tags: [Activity]
 *     description: Ce point de terminaison change l'état de visibilité d'une activité en non active.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de l'activité
 *     responses:
 *       200:
 *         description: L'activité est déjà non active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est déjà non active
 *       201:
 *         description: L'activité est maintenant non active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est désormais non active
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
 * 
 * /activity/{id}/isGuidee:
 *  get:
 *   summary: Vérifie si une activité est guidée.
 *   tags: [Activity]
 *   parameters:
 *    - name: id
 *      in: path
 *      required: true
 *      description: L'ID de l'activité dont on vérifie le statut guidée ou pas
 *      type: string
 *   responses:
 *    200:
 *     description: Status de l'activité (guidée ou pas)
 *     content:
 *      application/json:
 *       schema:
 *        type: boolean
 *        example: false
 *        description: Status de l activité (guidée ou pas)
 *    404:
 *     description: L'activité n'a pas été trouvée en base de données.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: string
 *          description: Message d'erreur
 * /activity/{id}/change-to-guidee:
 *   post:
 *     summary: Changer la statut Actif de l'activité à guidée
 *     tags: [Activity]
 *     description: Ce point de terminaison change l'état de l'activité d'une activité en guidée.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de la activité
 *     responses:
 *       200:
 *         description: L'activité est déjà guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est déjà guidée
 *       201:
 *         description: L'activité est maintenant guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est désormais guidée
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
 * /activity/{id}/change-to-not-guidee:
 *   post:
 *     summary: Changer la visibilité de la activité à non guidée
 *     tags: [Activity]
 *     description: Ce point de terminaison change l'état de visibilité d'une activité en non guidée.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         description: L'ID de la activité
 *     responses:
 *       200:
 *         description: L'activité est déjà non guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est déjà non guidée
 *       201:
 *         description: L'activité est maintenant non guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Activité {titre} est désormais non guidée
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
 * /activity/{idActivity}/etat/{idUser}:
 *  get:
 *   summary: L'état d'avancement d'un participant dans une activité
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idUser
 *      in: path
 *      description: ID du participant
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    200:
 *      description: L'état d'avancement d'un participant dans une activité
 *      content:
 *       application/json:
 *         schema:
 *           type: string
 *           example: EN_COURS
 * /activity/listetat/{idMission}/{idUser}:
 *  get:
 *   summary: Récupère la liste des activités avec l'état de l'utilisateur pour une mission spécifique
 *   tags: [Activity]
 *   parameters:
 *    - in: path
 *      name: idMission
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *      description: L'ID de la mission
 *    - in: path
 *      name: idUser
 *      required: true
 *      schema:
 *       type: string
 *       pattern: "^[a-z0-9]{24}$"
 *      description: L'ID de l'utilisateur
 *   responses:
 *     200:
 *       description: La liste des activités avec l'état de l'utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: L'ID de l'activité
 *                   example: "667296bc1d9a23a22c9254f8"
 *                 titre:
 *                   type: string
 *                   description: Le titre de l'activité
 *                   example: "Mercredi"
 *                 description:
 *                   type: string
 *                   description: La description de l'activité
 *                   example: "Ceci est une description"
 *                 description_detaillee_produire:
 *                   type: string
 *                   description: La description détaillée pour produire
 *                   example: "Détails de l'activité production"
 *                 description_detaillee_consulter:
 *                   type: string
 *                   description: La description détaillée pour consulter
 *                   example: "Détails de l'activité consultation"
 *                 type:
 *                   type: string
 *                   description: Le type de l'activité
 *                   example: "Cours"
 *                 types:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Les fichiers media acceptés dans les réponses de l'activité
 *                   example: ["audio", "video"]
 *                 etat:
 *                   type: string
 *                   description: L'état de l'utilisateur dans l'activité
 *                   example: "NON_DEMARREE"
 *                 visible:
 *                   type: boolean
 *                   description: Visibilité de l'activité
 *                   example: false
 *                 active:
 *                   type: boolean
 *                   description: Si l'activité est active
 *                   example: false
 *                 guidee:
 *                   type: boolean
 *                   description: Si l'activité est guidée
 *                   example: false
 *                 __t:
 *                   type: string
 *                   description: Type discriminant
 *                   example: "Activity"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de création de l'activité
 *                   example: "2024-06-19T08:28:44.719Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date de mise à jour de l'activité
 *                   example: "2024-06-19T08:30:09.859Z"
 *                 __v:
 *                   type: integer
 *                   description: Version du document
 *                   example: 0
 *     404:
 *      description: Participant ou mission introuvable
 *     500:
 *      description: Erreur interne du serveur
 * /activity/{idActivity}/inscrire/{idUser}:
 *  post:
 *   summary: Inscription d'un participant à une activité, etat = non_demarree
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idUser
 *      in: path
 *      description: ID du participant
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    201:
 *     description: Activité avec ajout du participant à l'état NON_DEMARREE
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de l'activité
 *         description:
 *          type: string
 *          description: Description de l'activité
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants
 *         visible:
 *          type: boolean
 *          description: Statut de visibilité de l'activité
 *         active:
 *          type: boolean
 *          description: Statut Actif de l'activité
 *         guidée:
 *          type: boolean
 *          description: Statut Guidée de l'activité
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
 * /activity/{idActivity}/inscrireRoom/{idRoom}:
 *  post:
 *   summary: Inscription de tous les participants d'une salle à une activité (non déjà présent dans l'activité)
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité'
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idRoom
 *      in: path
 *      description: ID de la salle 
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    201:
 *     description: Activité avec ajout des participants (non déjà présent dans l'activité) à l'état NON_DEMARREE
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de l'activité
 *         description:
 *          type: string
 *          description: Description de l'activité
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
 * /activity/{idActivity}/start/{idUser}:
 *  post:
 *   summary: Le participant commence une activité, etat = en_cours
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idUser
 *      in: path
 *      description: ID du participant
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    201:
 *     description: Activité avec ajout du participant à l'état EN_COURS
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de l'activité
 *         description:
 *          type: string
 *          description: Description de l'activité
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
 * /activity/{idActivity}/end/{idUser}:
 *  post:
 *   summary: Le participant finit une activité, etat = terminee
 *   tags: [Activity]
 *   parameters:
 *    - name: idActivity
 *      in: path
 *      description: ID de l'activité
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *    - name: idUser
 *      in: path
 *      description: ID du participant
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    201:
 *     description: Activité avec ajout du participant à l'état TERMINEE
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de l'activité
 *         titre:
 *          type: string
 *          description: Titre de l'activité
 *         description:
 *          type: string
 *          description: Description de l'activité
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de l'activité
 *         active:
 *          type: string
 *          description: Statut Actif de l'activité
 *         guidée:
 *          type: string
 *          description: Statut Guidée de l'activité
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de l'activité
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans l'activité
 *    500:
 *     description: Erreur du serveur.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur indiquant une erreur interne du serveur.
 * /ressource-consulter/{activityId}:
 *  get:
 *   summary: Récupération des informations de la ressource consultée selon l'ID de l'activité
 *   tags: [Activity]
 *   parameters:
 *    - in: path
 *      name: activityId
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-z0-9]{24}$'
 *      description: ID de l'activité (24 caractères alphanumériques)
 *   responses:
 *    200:
 *     description: Informations de la ressource consultée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la ressource
 *         description:
 *          type: string
 *          description: Description de la ressource
 *         mediaId:
 *          type: string
 *          description: ID du média associé à la ressource
 *         type:
 *          type: string
 *          description: Type de la ressource
 *    404:
 *     description: Activité, salle, mission ou ressource non trouvée
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

// POST ACTIVITY 
ActivityController.route('/')
	.get(async (req, res, next) => {
        try {
			const activityList = await service.findAll();
            return res.status(200).json(activityList);
          }
		 catch (err) {
			next(err);
		}
	})
	.post(async (req, res, next) => {
		try {
	
			if (req.body.description_detaillee_consulter) {	   
				const savedConsulter = await ActivityConsulterService.createConsulter(req.body);
				return res.status(201).json(savedConsulter);
				} else 
					if (req.body.description_detaillee_produire) {
						const savedProduire = await ActivityProduireService.createProduire(req.body);
						return res.status(201).json(savedProduire);
						}
					else
					{
						const savedActivity = await service.create(req.body);
						return res.status(201).json(savedActivity);				
					}
			
        } catch (error) {
            console.error('Error in POST /activity/');

            if (error.name === 'ValidationError') {                
                const messages = Object.values(error.errors).map(err => err.message);         
                return res.status(400).json({ message: `Echec à la validation de l activité : ${messages.join(', ')}` });
            }
            next(error);
        }
    });

ActivityController.route('/consulter')
	.post(async (req, res, next) => {
		try {
			if (!req.body.description_detaillee_consulter) {
				return res.status(400).json({ message: 'Le champ description_detaillee_consulter est requis.'      });

			}
			const activityConsulter = await ActivityConsulterService.createConsulter(req.body);
			return res.status(201).send(activityConsulter);
        } catch (error) {
            console.error('Error in POST /activity/consulter');
                   
			if (error.name === 'ValidationError') {                
                const messages = Object.values(error.errors).map(err => err.message);         
                return res.status(400).json({ message: `Echec à la validation de l activité produire: ${messages.join(', ')}` });
            }
            next(error);
       
        }
    })
	.get(async (req, res, next) => {
		try {
			const activityConsulterList = await ActivityConsulterService.findAll();
			return res.status(200).send(activityConsulterList);
		} catch (error) {
			next(error);
		}
	});

ActivityController.route('/produire')
	.post(async (req, res, next) => {
		try {
			if (!req.body.description_detaillee_produire) {
				return res.status(400).json({
                    message: 'Le champ description_detaillee_produire est requis.'
                });
			}
			const activityProduire = await ActivityProduireService.createProduire(req.body);
			return res.status(201).send(activityProduire);
        } catch (error) {
            console.error('Error in POST /activity/produire');
            if (error.name === 'ValidationError') {                
                const messages = Object.values(error.errors).map(err => err.message);         
                return res.status(400).json({ message: `Echec à la validation de l activité produire: ${messages.join(', ')}` });
            }
            next(error);
        }
    })
	.get(async (req, res, next) => {
		try {
			const activityProduireList = await ActivityProduireService.findAll();
			return res.json(activityProduireList);
		} catch (err) {
			next(err);
		}
	});


// ROUTE ACTIVITE SELON SON ID ET DELETE BY ID => SUPPRESSION DE L ACTIVITE DANS LA MISSION QUI L A INTEGREE
ActivityController.route('/:id([a-z0-9]{24})/')
.get(async (req, res, next) => {
	try {
		const id = new Types.ObjectId(req.params.id);
		
		const activity = await service.findById(id);	
		return res.status(200).json(activity);
	} catch (err) {
		next(err);
	}
})
.delete(async (req, res, next) => {
	const id = new Types.ObjectId(req.params.id);
	const activity = await service.findById(id);
	if (!activity) {
		return res.status(404).json({ error: `Activité avec ID ${id} non trouvée` });
		}
	try {	
        // La  mission qui contiennent l'activity
        const missions = await Mission.find({ activites: id });
        for (const mission of missions) {
            mission.activites.pull(id); // On retire l activité de l'array activites
            mission.nb_activites = mission.activites.length; 
            await mission.save(); 
        }						
			await service.delete(id);
			return res.status(200).json({ message:  `Activité  ${id} supprimée avec succès` });
		} catch (error) {
			console.error('Error in DELETE /activity/id:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	}
);



// ROUTE ACTIVITY Id + ETAT USER Id Renvoie activité avec etat utilisateur userId comme etat

ActivityController.route('/:idActivity([a-z0-9]{24})/:idUser([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
					const activityId = new Types.ObjectId(req.params.idActivity);
					const activity = await service.find(activityId);	

					const userId = new Types.ObjectId(req.params.idUser);
					const user = await userService.find(userId);	
					// Fonction pour obtenir l'état de l'utilisateur
					if (user === null)
						{return res.status(404).send('Le participant est introuvable');}
					else {
						if (activity === null)
							{return res.status(404).send('L activité est introuvable');}
						else {
				
						const userState = await service.etatByUser(activityId, userId);
						// Construire la nouvelle réponse
						const newResponse = {
							_id: activity._id,
							titre: activity.titre,
							description: activity.description,
							description_detaillee_produire: activity.description_detaillee_produire,
							description_detaillee_consulter: activity.description_detaillee_consulter,
							type: activity.type,
							types: activity.types,
							etat: userState,  // Affecte l'état directement ici
							visible: activity.visible,
							active: activity.active,
							guidee: activity.guidee,
							__t: activity.__t,
							createdAt : activity.createdAt,
							updatedat: activity.updatedAt,
							__v: activity.__v
						};
						return res.status(200).json(newResponse);
					}
				}
				} catch (err) {
					console.error('Error in get /missions/idmission/iduser:');
					next(err);
				}
			});


// ROUTE ACTIVITY Id + ETAT USER Id Renvoie liste des activités avec etat utilisateur userId comme etat
ActivityController.route('/listetat/:idMission([a-z0-9]{24})/:idUser([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
					const missionId = new Types.ObjectId(req.params.idMission);
					const mission = await missionService.find(missionId);	

					const userId = new Types.ObjectId(req.params.idUser);
					const user = await userService.find(userId);	
					// Fonction pour obtenir l'état de l'utilisateur
					if (user === null)
						{return res.status(404).send('Le participant est introuvable');}
					else {
						if (mission === null)
							{return res.status(404).send('La mission est introuvable');}
						else {

							// On retrouve les activités de la mission
							const activityIdList = mission.activites;
							if (!activityIdList || activityIdList.length === 0) {
								return res.status(404).send('Aucune activité trouvée pour cette mission');
							}
							// Tableau pour stocker les résultats
							const responses = [];
	
							for (const activityId of activityIdList)
							{	
								const userState = await service.etatByUser(activityId, userId);
								const activity = await service.findById(activityId);

								// Construire la nouvelle réponse
								const newResponse = {
									_id: activity._id,
									titre: activity.titre,
									description: activity.description,
									description_detaillee_produire: activity.description_detaillee_produire,
									description_detaillee_consulter: activity.description_detaillee_consulter,
									type: activity.type,
									types: activity.types,
									etat: userState,  // Affecte l'état directement ici
									visible: activity.visible,
									active: activity.active,
									guidee: activity.guidee,
									__t: activity.__t,
									createdAt : activity.createdAt,
									updatedat: activity.updatedAt,
									__v: activity.__v
								};
								// Ajouter la réponse à la liste
								responses.push(newResponse)
							}
							return res.status(200).json(responses);

							}
						}
				} catch (err) {
					console.error('Error in get /missions/idmission/iduser:');
					next(err);
				}
			});




// AJOUT ET RETRAIT D'UNE ACTIVITE A UNE MISSION

ActivityController.route('/addToMission/:idActivity([a-z0-9]{24})/:idMission([a-z0-9]{24})')
.post(async (req, res) => {
    try {
        const idActivity = req.params.idActivity;
        const idMission = req.params.idMission;

        const activity = await service.findById(new Types.ObjectId(idActivity));
        if (!activity) {
            return res.status(404).json({ error: `Activité avec ID ${idActivity} non trouvée` });
        }

        const mission = await Mission.findById(new Types.ObjectId(idMission));
        if (!mission) {
            return res.status(404).json({ error: `Mission avec ID ${idMission} non trouvée` });
        }

        // Check if the activité is already part of any mission
        const activityInOtherMission = await Mission.findOne({ activites: activity._id });
        if (activityInOtherMission) {
            if (activityInOtherMission._id.equals(mission._id)) {
                // L'activité existe dans la mission
                return res.status(409).json({ message: `L'activité avec ID ${idActivity} est déjà présente dans cette mission.` });
            } else {
                // L'activité existe dans une autre mission
                return res.status(409).json({ 
                    message: `L'activité avec ID ${idActivity} est déjà présente dans une autre mission. Utilisez la méthode de duplication pour ajouter une activité similaire à cette mission.` 
                });
            }
        }

        if (mission.activites.includes(activity._id)) {
            return res.status(409).json({ message: 'L\'activité est déjà présente dans la mission.' });
        }

        // On push l'activité car elle n'existe pas déjà 
        mission.activites.push(activity._id);
        mission.nb_activites += 1;
        
        await mission.save();
        
        return res.status(200).json(mission);
    } catch (error) {
        console.error('Error in Post /activity/mission/idAct/idMiss:', error);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
})
.delete(async (req, res) => {
    try {
        const idActivity = req.params.idActivity;
        const idMission = req.params.idMission;

        const activity = await service.findById(new Types.ObjectId(idActivity));
        if (!activity) {
            return res.status(404).json({ error: `Activité avec ID ${idActivity} non trouvée` });
        }

        const mission = await Mission.findById(new Types.ObjectId(idMission));
        if (!mission) {
            return res.status(404).json({ error: `Mission avec ID ${idMission} non trouvée` });
        }

        if (!mission.activites.includes(activity._id)) {
            return res.status(409).json({ message: 'L\'activité n\'est pas présente dans la mission.' });
        }

        // On retire l'activité car elle existe dans la mission  
		mission.activites = mission.activites.filter(id => !id.equals(activity._id));
        mission.nb_activites -= 1;
        
        await mission.save();
        
        return res.status(200).json({ message: `L\'activité ${activity} a été retirée de la mission avec succès.` });
    } catch (error) {
        console.error('Error in Delete /activity/mission/idAct/idMiss:', error);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
});

// DUPLIQUER UNE ACTIVITE
ActivityController.route('/duplicate/:idActivity([a-z0-9]{24})')
.post(async (req, res) => {
	try {
		const idActivity = req.params.idActivity;
		console.log('idActivity',idActivity);

		// Find the activity to be duplicated
		const activitytodup = await service.findById(new Types.ObjectId(idActivity));
		console.log('activitytodup',activitytodup);
		const isConsulter = activitytodup?.description_detaillee_consulter;
		const isProduire = activitytodup?.description_detaillee_produire;
		
		console.log('isConsulter',isConsulter);
		if (isProduire ) {
			console.log('yyyy');
		};
		if (!isConsulter && !isProduire ) {
			return res.status(404).json({ error: `Activité avec ID ${idActivity} non trouvée` });
		};
		if (isConsulter) {	
				const activityData: IActivityConsulter = {
					_id: new Types.ObjectId(), 
					titre: activitytodup.titre + '-Copie',
					description: activitytodup.description,
					etat: activitytodup.etat,
					description_detaillee_consulter: activitytodup.description_detaillee_consulter,
					active: activitytodup.active,
					guidee: activitytodup.guidee,
					visible: activitytodup.visible,
					type: activitytodup.type,	
				}
				const duplicatedActivityConsulter = await ActivityConsulterService.createConsulter(activityData);
				return res.status(200).json(duplicatedActivityConsulter);
			}
			if (isProduire) {	
				const activityData: IActivityProduire = {
					_id: new Types.ObjectId(), 
					titre: activitytodup.titre + '-Copie',
					description: activitytodup.description,
					etat: activitytodup.etat,
					description_detaillee_produire: activitytodup.description_detaillee_produire,
					active: activitytodup.active,
					guidee: activitytodup.guidee,
					visible: activitytodup.visible,
					types: activitytodup.types,	
				}
				const duplicatedActivityConsulter = await ActivityProduireService.createProduire(activityData);
				return res.status(200).json(duplicatedActivityConsulter);
			}

		
	} catch (error) {
		console.error('Error in POST activity/duplicate/:idActivity:', error);
		return res.status(500).json({ message: 'Erreur du serveur' });
	}
	});


	
	// ROUTES STATUTS DES ACTIVITES VISIBLE ACTIVE GUIDEE : CHECK et CHANGEMENTS

// ROUTE STATUT VISIBLE
ActivityController.route('/:id([a-z0-9]{24})/isVisible')
    .get(async (req, res) => {
        try {
            const id = new Types.ObjectId(req.params.id);
			const activity = await service.findById(id);
			if (!activity) {
				return res.status(404).json('Activité introuvable');
			}
            const statusVisible = await service.findVisibilityStatus(id);
            return res.status(200).json(statusVisible);
        } catch (error) {
            console.error('Error in GET /activity/{id}/isVisible:', error);
            return res.status(500).json({ message: 'Erreur du serveur' });
        }
    });

// ROUTE CHANGE TO VISIBLE
ActivityController.route('/:id([a-z0-9]{24})/change-to-visible')
    .post(async (req, res) => {
        const id = req.params.id;
        const activity = await service.find(new Types.ObjectId(id));

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }
			if (!activity) {
				return res.status(404).json('Activité introuvable');
			}

        try {
            const statusVisible = await service.findVisibilityStatus(new Types.ObjectId(id));
            console.log('status visible', statusVisible);
            const titre = await service.findTitreById(new Types.ObjectId(id));
            if (statusVisible === true) {
                return res.status(200).json('Activité :  ' + titre + ' est déjà visible');
            } else {
                if (activity) {
                    activity.visible = true;
                    await activity.save();
                    return res.status(201).json('Activité :  ' + titre + ' est désormais visible');
                }
            }
        } catch (error) {
            console.error(error);
			return res.status(500).send('Internal Server Error');
        }
    });

// ROUTE CHANGE TO NOT VISIBLE
ActivityController.route('/:id([a-z0-9]{24})/change-to-not-visible')
    .post(async (req, res) => {
        const id = req.params.id;
        const activity = await service.find(new Types.ObjectId(id));

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }
		if (!activity) {
			return res.status(404).json('Activité introuvable');
		}
        try {
            const statusVisible = await service.findVisibilityStatus(new Types.ObjectId(id));
            const titre = await service.findTitreById(new Types.ObjectId(id));
            console.log('statut visible', statusVisible);
            if (!statusVisible) {
                return res.status(200).json('Activité :  ' + titre + ' est déjà non visible');
            } else {
			if (activity) {
				activity.visible = false;
				await activity.save();
				return res.status(201).json('Activité :  ' + titre + ' est désormais non visible');
			}
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    });
// ROUTE STATUT ACTIVE
ActivityController.route('/:id([a-z0-9]{24})/isActive')
    .get(async (req, res) => {
        try {
            const id = new Types.ObjectId(req.params.id);

            const isActiveStatus = await service.findActiveStatus(id);
            return res.status(200).json(isActiveStatus);
        } catch (error) {
            console.error('Error in GET /activity/{id}/isActive:', error);
            return res.status(500).json({ message: 'Erreur du serveur' });
        }
    });

// ROUTE CHANGE TO ACTIVE
ActivityController.route('/:id([a-z0-9]{24})/change-to-active')
    .post(async (req, res) => {
        const id = req.params.id;
        const activity = await service.find(new Types.ObjectId(id));

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }
		if (!activity) {
			return res.status(404).json('Activité introuvable');
		}

        try {
            const statusActive = await service.findActiveStatus(new Types.ObjectId(id));
            const titre = await service.findTitreById(new Types.ObjectId(id));
            console.log('statut active', statusActive);
            if (statusActive) {
                return res.status(200).json('Activité :  ' + titre + ' est déjà active');
            } else {           
                if (activity) {
                    activity.active = true;
                    await activity.save();
                    return res.status(201).json('Activité :  ' + titre + ' est désormais active');
                }
                
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    });
// ROUTE CHANGE TO NOT ACTIVE
ActivityController.route('/:id([a-z0-9]{24})/change-to-not-active')
    .post(async (req, res) => {
        const id = req.params.id;
        const activity = await service.find(new Types.ObjectId(id));

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }
		if (!activity) {
			return res.status(404).json('Activité introuvable');
		}
        try {
            const statusActive = await service.findActiveStatus(new Types.ObjectId(id));
            const titre = await service.findTitreById(new Types.ObjectId(id));
            console.log('statut active', statusActive);
            if (!statusActive) {
                return res.status(200).json('Activité :  ' + titre + ' est déjà non active');
            } else {
                if (activity) {
                    activity.active = false;
                    await activity.save();
                    return res.status(201).json('Activité :  ' + titre + ' est désormais non active');
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    });

	// ROUTE STATUT GUIDEE
ActivityController.route('/:id([a-z0-9]{24})/isGuidee')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);

			const isGuideeStatus = await service.findGuideeStatus(id);
			return res.status(200).json(isGuideeStatus);
		} catch (error) {
			console.error('Error in GET /activity/{id}/isActive:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});

// ROUTE CHANGE TO GUIDEE
ActivityController.route('/:id([a-z0-9]{24})/change-to-guidee')
	.post(async (req, res) => {
		const id = req.params.id;
		const activity = await service.find(new Types.ObjectId(id));

		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
		if (!activity) {
			return res.status(404).json('Activité introuvable');
		}

		try {
			const statusGuidee = await service.findGuideeStatus(new Types.ObjectId(id));
			const titre = await service.findTitreById(new Types.ObjectId(id));
			console.log('statut guidee', statusGuidee);
			if (statusGuidee) {
				return res.status(200).json('Activité :  ' + titre + ' est déjà guidée');
			} else {
				
				if (activity) {
					activity.guidee = true;
					await activity.save();
					return res.status(201).json('Activité :  ' + titre + ' est désormais guidée');
				}
				
			}
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});
// ROUTE CHANGE TO NOT GUIDEE
ActivityController.route('/:id([a-z0-9]{24})/change-to-not-guidee')
	.post(async (req, res) => {
		const id = req.params.id;
		const activity = await service.find(new Types.ObjectId(id));

		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
		if (!activity) {
			return res.status(404).json('Activité introuvable');
		}
		try {
			const statusGuidee = await service.findGuideeStatus(new Types.ObjectId(id));
			const titre = await service.findTitreById(new Types.ObjectId(id));
			console.log('statut guidee', statusGuidee);
			if (!statusGuidee) {
				return res.status(200).json('Activité :  ' + titre + ' est déjà non guidée');
			} else {
				if (activity) {
					activity.guidee = false;
					await activity.save();
					return res.status(201).json('Activité :  ' + titre + ' est désormais non guidée');
				}
			}
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});

//  GESTION DES ETATS 
// QUEL ETAT POUR UN USER
ActivityController.route('/:activityId([a-z0-9]{24})/etat/:userId([a-z0-9]{24})/') 
	.get(async (req, res) => {

		try {
			const activityId = new Types.ObjectId(req.params.activityId);
			const userId = new Types.ObjectId(req.params.userId);	
			const user = await userService.find(userId);
			const activity =  await service.find(activityId);
			console.log('userid',user);
			if (user === null)
				{return res.status(404).send('Le participant est introuvable');}
			else {
				{
					if (activity === null)
						{return res.status(404).send('L activité est introuvable');}
					else {

						const etatByUser = await service.etatByUser(activityId, userId);
						if (Object.values(EEtat).includes(etatByUser)) {
							return res.status(200).send(etatByUser);
						} else {
							return res.status(200).send(etatByUser);
						}
					}
				}
			}
	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});

// ROUTE INSCRIRE  POUR UN USER  DANS UNE Activite   ======= INSCRIPTION ==============
ActivityController.route('/:activityId([a-z0-9]{24})/inscrire/:userId([a-z0-9]{24})/') 
	.post(async (req, res) => {
		try {
			const activityId = new Types.ObjectId(req.params.activityId);
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			const activity =  await service.find(activityId);
			console.log('userid',user);
			if (user === null)
				{return res.status(404).send('Le participant n existe pas en bdd');}
			else {
				{
					if (activity === null)
						{return res.status(404).send('L activité est introuvable');}
					else {
				// S assurer que le userId n est pas déjà dans les etats
				const isInEtat = await service.etatByUser(activityId, userId);
				if (isInEtat === 'NON_DEMARREE' || isInEtat === 'EN_COURS' || isInEtat === 'TERMINEE') {
					console.log('User déjà in array', isInEtat );
					return res.status(500).send(`Ce participant est déjà inscrit à cette activité. État d'avancement: ${isInEtat}`);

				} else {
					const actvityEtatNonDem = await service.inscriptionActivity(activityId, userId);
					if (actvityEtatNonDem)
					{return res.status(200).send(actvityEtatNonDem);}
				}
			}
		}
	}
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});

// ROUTE INSCRIRE  POUR TOUS LES PARTICIPANTS D UNE SALLE ======= INSCRIPTION SALLE ENTIERE ==============
ActivityController.route('/:activityId([a-z0-9]{24})/inscrireRoom/') 
	.post(async (req, res) => {
        try {
            const activityId = new Types.ObjectId(req.params.activityId);
			// Dans quelle mission est l'activité ?
			const mission =  await missionService.findMissionByActivity(activityId);

			// Dans quelle salle est la mission ?
			const roomId = new Types.ObjectId(mission?.roomId);
            //  La liste des participants dans la salle
            const room = await roomService.findById(roomId);
			if (!room) {
                return res.status(404).send('Room non trouvée.');
            }
            const participants = room.participants || [];

            const results = [];

            for (const userId of participants) {
                const userObjectId = new Types.ObjectId(userId);
                
                // Ensure the user is not already in the states
                const isInEtat = await activityService.etatByUser(activityId, userObjectId);
				if (Object.values(EEtat).includes(isInEtat)) {
					console.log('ouipipi');

                    results.push({ userId, message: `Ce participant est déjà inscrit à cette activité. État d'avancement: ${isInEtat}` });
                } else {
                    const inscription = await activityService.inscriptionActivity(activityId, userObjectId);
                    if (inscription) {
                        results.push({ userId, message: 'Inscription réussie'});
                    } else {
                        results.push({ userId, message: 'Erreur lors de l\'inscription' });
                    }
                }
            }

            return res.status(200).json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    });
// ROUTE ACTIVITE EN COURS POUR UN USER ====== START =====
// Passage de l UserId de  état["NON_DEMARREE": {userId}] à  état["EN_COURS": {userId}] 
ActivityController.route('/:activityId([a-z0-9]{24})/start/:userId([a-z0-9]{24})/')
	.post(async (req, res) => {
		try {
			const activityId = new Types.ObjectId(req.params.activityId);
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			const activity =  await service.find(activityId);

			if (user === null)
				{return res.status(404).send('Le participant est introuvable');}
			
		
			if (activity === null)
				{return res.status(404).send('L activité est introuvable');}
		
				// S assurer que le userId n est pas déjà dans les etats
				const isInEtat = await service.etatByUser(activityId, userId);
				console.log('Isinetat',isInEtat);
				if (isInEtat === 'EN_COURS') {
					console.log('User déjà in array', isInEtat );
					return res.status(500).send('Activité déjà en cours pour ce participant');

				} else  if (isInEtat === 'TERMINEE'){
					return res.status(500).send('Activité déjà terminée pour ce participant');

				} else  if (isInEtat === 'NON_DEMARREE') {
					const actvityDemPourUser = await service.startActivity(activityId, userId);
					if (actvityDemPourUser)
						{
							// On vérifie si l'état de la mission où se trouve l'activité est déjà à EN_COURS pour cet user  sinon on la passe à en cours
							const mission =  await missionService.findMissionByActivity(activityId);
							const userStateMission = await missionService.etatByUser(mission._id, userId);
							if (userStateMission === 'NON_DEMARREE') {
								await missionService.startMission(mission._id, userId);
							}
							return res.status(200).send(actvityDemPourUser);

						}
					}
            }
            
        catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    });
// ROUTE ACTIVITE TERMINEE POUR UN USER  ====== END  =====
// Passage de l UserId de  état["EN_COURS": {userId}] à  état["TERMINEE": {userId}] 
ActivityController.route('/:activityId([a-z0-9]{24})/end/:userId([a-z0-9]{24})/')
	.post(async (req, res) => {
		try {
			const activityId = new Types.ObjectId(req.params.activityId);
			const activity =  await service.find(activityId);		
			if (activity === null)
				{return res.status(404).send('L activité est introuvable');}
		
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			if (user === null)
				{return res.status(404).send('Le participant est introuvable');}
			else {
				// S assurer que le userId n est pas déjà dans les etats
				const isInEtat = await service.etatByUser(activityId, userId);
				console.log('Isinetat',isInEtat);
				if (isInEtat === 'NON_DEMARREE') {
					console.log('User n a pas commencé l activité', isInEtat );
					return res.status(500).send('Le participant est inscrit mais n a jamais démarré l activité, nous ne pouvons pas changer l état à terminée.');

				} else  if (isInEtat === 'TERMINEE'){
					console.log('User déjà in array', isInEtat );
					return res.status(500).send('Activité déjà terminée pour cet User');

				} else  if (isInEtat === 'EN_COURS') {
					const actvityTermineePourUser = await service.endActivity(activityId, userId);
					if (actvityTermineePourUser)
					{	// On vérifie si toutes les autres activités de la mission sont aussi terminees, si oui on termine la mission pour cet user
						const mission =  await missionService.findMissionByActivity(activityId);
						if (mission === null)
							{return res.status(404).send('Mission introuvable');}
						const activityIdList = mission?.activites;

						const result =[];

						for (const activityId of activityIdList)
							{
								const etatUser = await service.etatByUser(activityId, userId);
								result.push(etatUser);
							}
						const allTerminee = result.every(etat => etat === "TERMINEE");

						if (allTerminee) {
							console.log("Toutes les activités de la mission sont 'terminee'");
							// On passe l etat de l user à TERMINEE pour la mission
							await missionService.endMission(mission?._id, userId);

						} else {
							console.log("Des activités ne sont pas 'terminee'");
						}
										
						return res.status(200).send(actvityTermineePourUser);}
			}
			else return res.status(500).send('Le user n a pas été inscrit à l activité, il n est pas présent dans les etats de celle ci');
		}
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});


ActivityController.route('/ressource-consulter/:activityId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const activityId = new Types.ObjectId(req.params.activityId);

			// Ctrl activity pour activite introuvable
			const activity = await service.findById(activityId);

			if (activity === null) {
				return res.status(404).send("L'activité est introuvable");
			}
			
			// Trouver toutes la mission 
			const mission = await missionService.findMissionByActivity(activityId);
			const roomId = new Types.ObjectId(mission?.roomId);
			const room  = await roomService.findById(roomId);

			if (!room) {
				return res.status(404).send("La salle est introuvable");
			}

			// Moderateur 
			const userId = new Types.ObjectId(room.moderatorId);

			// TEMPORAIRE AXIOS
			const axios = require('axios');
			
			try {
				const response = await axios.get(`${config.BASE_URL}/datas/${activityId}/${userId}`);
				console.log('response', response);

				if (response.data && response.data.length > 0) {
					// Première USERDATA DE l'activité
					const data = response.data[0];

					const newResponse = {
						_id: data._id,
						description: data.description,
						mediaId: data.mediaId,
						type: data.type
					};

					// Retourne la réponse
					return res.json(newResponse);
				} else {
					return res.status(404).json({ message: 'Pas de ressource pour cette activité' });
				}
			} catch (error) {
				if (error.response && error.response.status === 404) {
					return res.status(404).json({ message: 'Pas de ressource pour cette activité' });
				}
				throw error;
			}

		} catch (err) {
			console.error('Erreur dans get /ressource-consulter/:activityId', err);
			next(err);
		}
	});


export default ActivityController;