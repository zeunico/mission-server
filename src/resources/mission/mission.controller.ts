import { Router } from 'express';
import { Types } from 'mongoose';
import { MissionService } from '../mission/mission.service';
import { ActivityService } from '../activity/activity.service';
import { MediaService } from '../media/media.service';
import { UsersService } from '../users/users.service';
import { RoomService } from '../room/room.service';
import { IMission } from '~~/types/mission.interface';
import { extname, join } from 'path';
import fs from 'fs';
import { config } from '~/config';
import multer from 'multer';
import { getFileTypeByExtension, getFileNameFormatted } from '~/utils/file.utils';
import EEtat from '~~/types/etat.enum';
import { start } from 'repl';


// Création d'un Router Express
const MissionController: Router = Router();

// Instanciation des Services

const service = new MissionService();
const roomService = new RoomService();

const mediaService = new MediaService();
const activityService = new ActivityService();
const userService = new UsersService();

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
 * /mission/{roomCode}:
 *  post:
 *   summary: Création d'une mission (Route avec RoomCode)
 *   tags: [Mission]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        titre:
 *         type: string
 *         description: Titre de la mission
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
 *  get:
 *   summary: Récupérer une liste de missions par code de salle
 *   tags: [Mission]
 *   parameters:
 *     - in: path
 *       name: roomCode
 *       required: true
 *       schema:
 *         type: string
 *       description: Le code de la salle pour laquelle récupérer les missions
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
 *           description: L'ID de la mission
 *          name:
 *           type: string
 *           description: Le nom de la mission
 *          description:
 *           type: string
 *           description: La description de la mission
 *     404:
 *       description: Salle non trouvée
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           error:
 *           type: string
 *           description: Un message d'erreur
 *     500:
 *      description: Erreur interne du serveur
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           error:
 *            type: string
 *            description: Un message d'erreur
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
 *     description: La mission trouvée avec succès.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: Code identifiant (ID) de la mission généré par la base de données
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
 *          description: Stutut actif de la mission
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
 *  delete:
 *   summary: Supprime une mission à partir de son ID passé en paramètre.
 *   tags: [Mission]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de la mission
 *      type: string
 *      required: true
 *   responses:
 *    200:
 *     description: La mission supprimée avec succès.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: Code identifiant (ID) de la mission généré par la base de données
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
 *          description: Statut actif de la mission
 *         guidee :
 *          type: boolean
 *          description: Mission Guidee
 *         visuel :
 *          type: string
 *          description: Visuel
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
 *         description: La mission est déjà visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est déjà visible
 *       201:
 *         description: La mission est maintenant visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est désormais visible
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
* /mission/{id}/change-to-not-visible:
 *   post:
 *     summary: Changer la visibilité de la mission à non visible
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état de visibilité d'une mission en non visible.
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
 *         description: La mission est déjà non visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est déjà non visible
 *       201:
 *         description: La mission est maintenant non visible
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est désormais non visible
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
 * /mission/{id}/change-to-active:
 *   post:
 *     summary: Changer la statut Actif de la mission à visible
 *     tags: [Mission]
 *     description: Ce point de terminaison change le statut Actif d'une mission en active.
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
 * /mission/{id}/change-to-not-active:
 *   post:
 *     summary: Changer la visibilité de la mission à non active
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état de visibilité d'une mission en non active.
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
 *         description: La mission est déjà non active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est déjà non active
 *       201:
 *         description: La mission est maintenant non active
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est désormais non active
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
 * /mission/{id}/change-to-guidee:
 *   post:
 *     summary: Changer la statut Actif de la mission à guidée
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état de l'activité d'une mission en guidée.
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
 *         description: La mission est déjà guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est déjà guidée
 *       201:
 *         description: La mission est maintenant guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est désormais guidée
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
 * /mission/{id}/change-to-not-guidee:
 *   post:
 *     summary: Changer la visibilité de la mission à non guidée
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état de visibilité d'une mission en non guidée.
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
 *         description: La mission est déjà non guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est déjà non guidée
 *       201:
 *         description: La mission est maintenant non guidée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est désormais non guidée
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
 * /mission/{idMission}/activitesID:
 *   get:
 *     summary: Récupère les ID des activités dans une mission.
 *     tags: [Mission]
 *     parameters:
 *       - name: idMission
 *         in: path
 *         description: ID de la mission
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des ID des activités dans la mission
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Liste des ID des activités dans la mission
 *       400:
 *         description: Le champ ID est manquant.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Le champ ID est manquant.
 *       404:
 *         description: Mission non trouvée.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mission non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 * /mission/{idMission}/activites:
 *   get:
 *     summary: Récupère toutes les activités dans une mission.
 *     tags: [Mission]
 *     parameters:
 *       - name: idMission
 *         in: path
 *         description: ID de la mission
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des activités dans la mission
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Liste des activités dans la mission
 *       400:
 *         description: Le champ ID est manquant.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Le champ ID est manquant.
 *       404:
 *         description: Mission non trouvée.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mission non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 * /mission/{idMission}/activitesVisibles:
 *   get:
 *     summary: Récupère les activités visibles dans une mission.
 *     tags: [Mission]
 *     parameters:
 *       - name: idMission
 *         in: path
 *         description: ID de la mission
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des activités visibles dans la mission
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Liste des activités visibles
 *       400:
 *         description: Le champ ID est manquant.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Le champ ID est manquant.
 *       404:
 *         description: Mission non trouvée.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mission non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 * /mission/{idMission}/activitesActives:
 *   get:
 *     summary: Récupère les activités actives dans une mission.
 *     tags: [Mission]
 *     parameters:
 *       - name: idMission
 *         in: path
 *         description: ID de la mission
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des activités actives dans la mission
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Liste des activités actives
 *       400:
 *         description: Le champ ID est manquant.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Le champ ID est manquant.
 *       404:
 *         description: Mission non trouvée.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mission non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 * /mission/{idMission}/activitesGuidees:
 *   get:
 *     summary: Récupère les activités guidées dans une mission.
 *     tags: [Mission]
 *     parameters:
 *       - name: idMission
 *         in: path
 *         description: ID de la mission
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des activités guidées dans la mission
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Liste des activités guidées
 *       400:
 *         description: Le champ ID est manquant.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Le champ ID est manquant.
 *       404:
 *         description: Mission non trouvée.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Mission non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 * /mission/{idMission}/visuel:
 *  get:
 *   summary: Récupération du visuele d la mission à partir de l'ID mission passé en paramètre.
 *   tags: [Mission]
 *   parameters:
 *    - name: id
 *      in: path
 *      description: ID de la mission
 *      required: true
 *   responses:
 *    200:
 *     description: Fichier du visuel récupéré avec succès.
 *     content:
 *      application/octet-stream:
 *       schema:
 *        type: string
 *        format: binary
 *    404:
 *     description: Visuel non trouvé
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * /mission/{idMission}/change-visuel:
 *  post:
 *   summary: Changement du visuel de la mission
 *   tags: [Mission]
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
 *   responses:
 *    201:
 *     description: Visuel modifié
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID du visuel
 *         name:
 *          type: string
 *          description: Nom du visuel
 *         type:
 *          type: string
 *          description: Type du média
 *          enum: [image, video]
 *         userId:
 *          type: string
 *          description: ID de l'utilisateur propriétaire du média ie moderator dans le cas d'un visuel 
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
 * /mission/{idMission}/etat/{idUser}:
 *  get:
 *   summary: L'état d'avancement d'un participant dans une mission
 *   tags: [Mission]
 *   parameters:
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
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
 *      description: L'état d'avancement d'un participant dans une mission
 *      content:
 *       application/json:
 *         schema:
 *           type: string
 *           example: EN_COURS
 * /mission/{idMission}/inscrire/{idUser}:
 *  post:
 *   summary: Inscription d'un participant à une mission, etat = non_demarree
 *   tags: [Mission]
 *   parameters:
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
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
 *     description: Mission avec ajout du participant à l'état NON_DEMARREE
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
 *         description:
 *          type: string
 *          description: Description de la mission
 *         etat:
 *          type: array
 *          description: Etats d'avancement de l'activité pour chacun des participants dans la mission
 *         visible:
 *          type: array
 *          description: Statut de visibilité de la mission
 *         active:
 *          type: string
 *          description: Statut Actif de la mission
 *         guidée:
 *          type: string
 *          description: Statut Guidée de la mission
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de la mission
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans la mission
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
 * /mission/{idMission}/inscrireRoom/:
 *  post:
 *   summary: Inscription de tous les participants d'une salle à une mission (non déjà présent dans la mission)
 *   tags: [Mission]
 *   parameters:
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
 *      required: true
 *      schema:
 *        type: string
 *        pattern: "^[a-z0-9]{24}$"
 *   responses:
 *    201:
 *     description: Mission avec ajout des participants (non déjà présent dans l'activité) à l'état NON_DEMARREE
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
 *         description:
 *          type: string
 *          description: Description de la mission
 *         etat:
 *          type: array
 *          description: Etats d'avancement de la missionpour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de la mission
 *         active:
 *          type: string
 *          description: Statut Actif de la mission
 *         guidée:
 *          type: string
 *          description: Statut Guidée de la mission
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de la mission
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans la mission
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
 * /mission/{idMission}/start/{idUser}:
 *  post:
 *   summary: Le participant commence une mission, etat = en_cours
 *   tags: [Mission]
 *   parameters:
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
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
 *     description: Mission avec ajout du participant à l'état EN_COURS
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
 *         description:
 *          type: string
 *          description: Description de la mission
 *         etat:
 *          type: array
 *          description: Etats d'avancement de la missionpour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de la mission
 *         active:
 *          type: string
 *          description: Statut Actif de la mission
 *         guidée:
 *          type: string
 *          description: Statut Guidée de la mission
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de la mission
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans la mission
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
 * /mission/{idMission}/end/{idUser}:
 *  post:
 *   summary: Le participant finit une mission, etat = terminee
 *   tags: [Mission]
 *   parameters:
 *    - name: idMission
 *      in: path
 *      description: ID de la mission
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
 *     description: Mission avec ajout du participant à l'état TERMINEE dans la mission
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
 *         description:
 *          type: string
 *          description: Description de la mission
 *         etat:
 *          type: array
 *          description: Etats d'avancement de la missionpour chacun des participants
 *         visible:
 *          type: array
 *          description: Statut de visibilité de la mission
 *         active:
 *          type: string
 *          description: Statut Actif de la mission
 *         guidée:
 *          type: string
 *          description: Statut Guidée de la mission
 *         description_detaillee_consulter:
 *          type: string
 *          description: Description détaillée de la mission
 *         type:
 *          type: string
 *          description: Type de fichier acceptés dans la mission
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
 * /mission/{idMission}/{idUser}:
 *   get:
 *     summary: Récupère une mission et l'état d'un utilisateur pour cette mission
 *     tags: [Mission]
 *     parameters:
 *       - in: path
 *         name: idMission
 *         schema:
 *           type: string
 *           pattern: "^[a-z0-9]{24}$"
 *         required: true
 *         description: ID de la mission
 *       - in: path
 *         name: idUser
 *         schema:
 *           type: string
 *           pattern: "^[a-z0-9]{24}$"
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Informations sur la mission et l'état de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5ec49e0d2b524789a1c4b"
 *                 titre:
 *                   type: string
 *                   example: "Mission Title"
 *                 roomId:
 *                   type: string
 *                   example: "60d5ec49e0d2b524789a1c4b"
 *                 activites:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "60d5ec49e0d2b524789a1c4b"
 *                 nb_activites:
 *                   type: number
 *                   example: 5
 *                 etat:
 *                   type: string
 *                   example: "EN_COURS"
 *                 visible:
 *                   type: boolean
 *                   example: true
 *                 active:
 *                   type: boolean
 *                   example: true
 *                 guidee:
 *                   type: boolean
 *                   example: true
 *                 visuel:
 *                   type: string
 *                   example: "60d5ec49e0d2b524789a1c4b"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2021-06-25T15:20:49.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2021-06-25T15:20:49.000Z"
 *                 __v:
 *                   type: number
 *                   example: 0
 *       404:
 *         description: La mission ou l'utilisateur est introuvable
 *       500:
 *         description: Erreur serveur
 * /missions/listetat/{roomId}/{userId}:
 *   get:
 *     summary: Récupère la liste des missions dans une salle avec l'état pour un utilisateur
 *     tags: [Mission]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *           pattern: "^[a-z0-9]{24}$"
 *         required: true
 *         description: ID de la salle
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           pattern: "^[a-z0-9]{24}$"
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des missions et l'état de l'utilisateur pour chaque mission
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5ec49e0d2b524789a1c4b"
 *                   titre:
 *                     type: string
 *                     example: "Mission Title"
 *                   roomId:
 *                     type: string
 *                     example: "60d5ec49e0d2b524789a1c4b"
 *                   activites:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "60d5ec49e0d2b524789a1c4b"
 *                   nb_activites:
 *                     type: number
 *                     example: 5
 *                   etat:
 *                     type: string
 *                     example: "EN_COURS"
 *                   visible:
 *                     type: boolean
 *                     example: true
 *                   active:
 *                     type: boolean
 *                     example: true
 *                   guidee:
 *                     type: boolean
 *                     example: true
 *                   visuel:
 *                     type: string
 *                     example: "60d5ec49e0d2b524789a1c4b"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2021-06-25T15:20:49.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2021-06-25T15:20:49.000Z"
 *                   __v:
 *                     type: number
 *                     example: 0
 *       404:
 *         description: Aucune mission trouvée pour cette salle ou utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */
// ROUTE RACINE LISTE TOUTES LES MISSIONS ET ROUTE POST PAR ROOM ID
MissionController.route('/')
	.get(async (req, res) => {
		
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
				const mission = await service.createMission(req.body);
				const room = await roomService.findById(req.body.roomId);
				if (room) {
					const roomId = new Types.ObjectId(req.body.roomId);
				    room.mission.push(mission._id);	
				    await RoomService.update(room, roomId);
				} else {console.log('salle inconnue');}

				return res.status(201).json(mission);
			}	
		}		
		catch (error) {
			console.error('Error in POST /missions:', error);
			return res.status(500).json({ message: 'Erreur de pramàtres' });
		}
	});
// ROUTE POST MISSION DANS UNE SALLE IDENTIFIEE PAR SON ROOMCODE &&
// GET LISTE DES MISSIONS DANS UNE SALLE PAR UN ROOMCODE  
MissionController.route('/:roomCode([A-Z-z0-9]{6})/')
	.post(async (req, res, next) => {
		try {
			const roomCode = req.params.roomCode;
			const room = await roomService.findByCode(roomCode);
			
			if (room) {
				const roomId = room._id;

				const mission = await service.createMissionByCode(req.body, roomId);

				room?.mission.push(mission._id);	
				await RoomService.update(room, roomId);				

				
				return res.status(201).json(mission);
				} else {
                return res.status(404).json({ message: 'Room not found' });
            	}
        } catch (error) {
            console.error('Error in POST /missions/:roomCode:');

            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ message: `Echec à la validation de la mission  : ${messages.join(', ')}` });
            }

            next(error);
		}
    })
	.get(async (req, res, next) => {
		try {
			const room = await roomService.findByCode(req.params.roomCode);
			if (room) {
				const missionList = room.mission;
				console.log('missionList', missionList);
	
				// Fetch all missions asynchronously
				const result = await Promise.all(missionList.map(async element => {
					return service.find(element);
				}));
	
				console.log('result', result);
	
				// Return the resolved array of missions
				return res.status(201).json(result);
			} else {
				// If the room is not found, return a 404 status
				return res.status(404).json({ error: 'Room not found' });
			}
		} catch (err) {
			console.error('Error in GET /liste missions par roomCode:', err);
			next(err);
		}
	});
// ROUTE MISSION PAR SON ID
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
	})
	// ROUTE DELETE MISSION PAR SON ID
	.delete(async (req, res, next) => {
		const id = new Types.ObjectId(req.params.id);
		const mission = await service.find(id);
		if (!mission) {
			return res.status(404).json({ error: `Mission avec ID ${id} non trouvée` });
			}
		try {
				await service.delete(id);
				const room = await roomService.findById(mission.roomId);
				if (room) {
					room.mission = room.mission.filter(id => !id.equals(mission._id));
					await room.save();
				}
				return res.status(200).json(mission);
			} catch (error) {
				console.error('Erreur dans DELETE /missions/id:', error);
				return res.status(500).json({ message: 'Erreur du serveur' });
			}
		}
	);
// ROUTE MISSION Id + ETAT USER Id pour une mission
MissionController.route('/:idMission([a-z0-9]{24})/:idUser([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
					const missionId = new Types.ObjectId(req.params.idMission);
					const mission = await service.find(missionId);	

					const userId = new Types.ObjectId(req.params.idUser);
					const user = await userService.find(userId);	
					// Fonction pour obtenir l'état de l'utilisateur
					if (user === null)
						{return res.status(404).send('Le participant est introuvable');}
					else {
						if (mission === null)
							{return res.status(404).send('La mission est introuvable');}
						else {
				
						const userState = await service.etatByUser(missionId, userId);
						// Construire la nouvelle réponse
						const newResponse = {
							_id: mission._id,
							titre: mission.titre,
							roomId: mission.roomId,
							activites: mission.activites,
							nb_activites: mission.nb_activites,
							etat: userState,  // Affecte l'état directement ici
							visible: mission.visible,
							active: mission.active,
							guidee: mission.guidee,
							visuel: mission.visuel,
							createdAt : mission.createdAt,
							updatedat: mission.updatedAt,
							__v: mission.__v
						};
					
						return res.status(200).json(newResponse);
					}
				}

				} catch (err) {
					console.error('Error in get /missions/idmission/iduser:');
					next(err);
				}
			});
// LISTE DES MISSIONS DANS UNE ROOM PAR ROOMID
MissionController.route('/byRoomId/:roomId([a-z0-9]{24})/')
	.get(async (req, res, next) => {
		try {
			const roomId = new Types.ObjectId(req.params.roomId);
			
			// Trouver toutes les missions associées à la roomId
			const missions = await service.findByRoomId(roomId);

			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);	
			console.log('ussser', user);

			if (!missions || missions.length === 0) {
				return res.status(404).send('Aucune mission trouvée pour cette salle');
			}	
			// Retourner la liste des missions
			return res.status(200).json(missions);

		} catch (err) {
			console.error('Error in get /missions/room/roomId:');
			next(err);
		}
	});
// LISTE DES MISSIONS (DANS UNE ROOM) FULL OBJECT AVEC ETAT POUR UN USERID COMME ETAT
MissionController.route('/listetat/:roomId([a-z0-9]{24})/:userId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const roomId = new Types.ObjectId(req.params.roomId);
			
			// Trouver toutes les missions associées à la roomId
			const missions = await service.findByRoomId(roomId);

			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);	
			console.log('ussser', user);

			if (!missions || missions.length === 0) {
				return res.status(404).send('Aucune mission trouvée pour cette salle');
			}

			// Tableau pour stocker les résultats
			const responses = [];

			// Boucle sur chaque mission pour construire newResponse
			for (const mission of missions) {
			
					const userState = await service.etatByUser(mission._id, user._id);
					// Construire newResponse pour chaque utilisateur
					const newResponse = {
						_id: mission._id,
						titre: mission.titre,
						roomId: mission.roomId,
						activites: mission.activites,
						nb_activites: mission.nb_activites,
						etat: userState,  // Affecte l'état directement ici
						visible: mission.visible,
						active: mission.active,
						guidee: mission.guidee,
						visuel: mission.visuel,
						createdAt: mission.createdAt,
						updatedAt: mission.updatedAt,
						__v: mission.__v
					};

					// Ajouter la réponse à la liste
					responses.push(newResponse);
				
			}

			// Retourner la liste des réponses
			return res.status(200).json(responses);

		} catch (err) {
			console.error('Error in get /missions/room/roomId:');
			next(err);
		}
	});
// ROUTES ET FONCTIONS POUR STATUS VISIBLE, ACTIVE et GUIDEE 
// STATUT VISIBLE CHECK
MissionController.route('/:id([a-z0-9]{24})/isVisible/')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);
			const  statusVisible = await service.findVisibilityStatus(new Types.ObjectId(id));
			return res.status(200).json(statusVisible);
				
		}
		catch (error) {
			console.error('Error in GET /missions/{id}/isVisible:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});
// ROUTE CHANGE TO VISIBLE
MissionController.route('/:id([a-z0-9]{24})/change-to-visible/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
	
		try {
			const  statusVisible = await service.findVisibilityStatus(new Types.ObjectId(id));
			console.log('status visible', statusVisible);
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			if (statusVisible === true) {
				return res.status(200).json('Mission :  ' + titre + ' est déjà visible');
			} else {
				if (mission) {
					mission.visible = true;
					await mission.save();
					return res.status(201).json('Mission :  ' + titre + ' est désormais visible');
				}
			} 	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});
// ROUTE CHANGE TO NOT VISIBLE
	MissionController.route('/:id([a-z0-9]{24})/change-to-not-visible/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}	
		try {
			const  statusVisible = await service.findVisibilityStatus(new Types.ObjectId(id));
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			console.log('statut visible', statusVisible);
			if (!statusVisible) {
				return res.status(200).json('Mission :  ' + titre + ' est déjà non visible');
			} else {
				if (mission) {
					mission.visible = false;
					await mission.save();
					return res.status(201).json('Mission :  ' + titre + ' est désormais non visible');
				}
			} 	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});
// ROUTE STATUT ACTIVE
MissionController.route('/:id([a-z0-9]{24})/isActive/')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);

            const isActiveStatus = await service.findActiveStatus(id);
			return res.status(200).json(isActiveStatus);
				
		}
		catch (error) {
			console.error('Error in GET /missions/{id}/isActive:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});
// ROUTE CHANGE TO ACTIVE
MissionController.route('/:id([a-z0-9]{24})/change-to-active/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
	
		try {
			const  statusActive = await service.findActiveStatus(new Types.ObjectId(id));
			console.log('status visible', statusActive);
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			if (statusActive === true) {
				return res.status(200).json('Mission :  ' + titre + ' est déjà active');
			} else {
				if (mission) {
					mission.active = true;
					await mission.save();
					return res.status(201).json('Mission :  ' + titre + ' est désormais active');
				}
			} 	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});
// ROUTE CHANGE TO NOT ACTIVE
MissionController.route('/:id([a-z0-9]{24})/change-to-not-active/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}	
		try {
			const  statusActive = await service.findActiveStatus(new Types.ObjectId(id));
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			console.log('statut visible', statusActive);
			if (!statusActive) {
				return res.status(200).json('Mission :  ' + titre + ' est déjà non active');
			} else {
				if (mission) {
					mission.active = false;
					await mission.save();
					return res.status(201).json('Mission :  ' + titre + ' est désormais non active');
				}
			} 	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});
// ROUTE STATUT GUIDEE
MissionController.route('/:id([a-z0-9]{24})/isGuidee/')
	.get(async (req, res) => {
		try {
			const id = new Types.ObjectId(req.params.id);

            const isGuideeStatus = await service.findGuideeStatus(id);
			return res.status(200).json(isGuideeStatus);
				
		}
		catch (error) {
			console.error('Error in GET /missions/{id}/isGuidee:', error);
			return res.status(500).json({ message: 'Erreur du serveur' });
		}
	});

// ROUTE CHANGE TO GUIDEE
MissionController.route('/:id([a-z0-9]{24})/change-to-guidee/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
	
		try {
			const  statusGuidee = await service.findGuideeStatus(new Types.ObjectId(id));
			console.log('status visible', statusGuidee);
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			if (statusGuidee === true) {
				return res.status(200).json('Mission :  ' + titre + ' est déjà guidée');
			} else {
				if (mission) {
					mission.guidee = true;
					await mission.save();
					return res.status(201).json('Mission :  ' + titre + ' est désormais guidée');
				}
			} 	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});
// ROUTE CHANGE TO NOT GUIDEE
MissionController.route('/:id([a-z0-9]{24})/change-to-not-guidee/')
	.post(async (req, res) => {
		const id = req.params.id;
		const mission = await service.find(new Types.ObjectId(id));
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}	
		try {
			const  statusActive = await service.findGuideeStatus(new Types.ObjectId(id));
			const titre = await service.findTitreByid(new Types.ObjectId(id));
			console.log('statut visible', statusActive);
			if (!statusActive) {
				return res.status(200).json('Mission :  ' + titre + ' est déjà non guidée');
			} else {
				if (mission) {
					mission.guidee = false;
					await mission.save();
					return res.status(201).json('Mission :  ' + titre + ' est désormais non guidée');
				}
			} 	
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});

// TOUTES LES ACTIVITES (ID) DANS LA MISSION
MissionController.route('/:id([a-z0-9]{24})/activitesID')
    .get(async (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }

        try {
            const mission = await service.find(new Types.ObjectId(id));
            const activityList = mission?.activites;

            if (mission) {
				return res.status(200).json(activityList);
            } else {
                return res.status(404).json('Mission non trouvée.');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json('Internal Server Error');
        }
    });

// TOUTES LES ACTIVITES (OBJETS) DANS LA MISSION
MissionController.route('/:id([a-z0-9]{24})/activites')
    .get(async (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }
        try {
            const mission = await service.find(new Types.ObjectId(id));
            if (!mission) {
                return res.status(404).json({ error: 'Mission non trouvée.' });
            }

            const activityIds = mission.activites || [];
            const activities = await Promise.all(
                activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
            );

            return res.status(200).json(activities);
        } catch (error) {
            console.error('Erreur lors de la récupération des activités de la mission.', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });

// Toutes les activités VISIBLES dans une mission
MissionController.route('/:id([a-z0-9]{24})/activitesVisibles')
    .get(async (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }

        try {
            const mission = await service.find(new Types.ObjectId(id));
            if (!mission) {
                return res.status(404).json({ error: 'Mission non trouvée.' });
            }

            const activityIds = mission.activites || [];
            const activities = await Promise.all(
                activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
            );

            // Filter activities to only include those with visible === true
            const visibleActivities = activities.filter(activity => activity.visible === true);
            return res.status(200).json(visibleActivities);
        } catch (error) {
            console.error('Error fetching mission visible activities:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });

	// Toutes les activités Actives dans une mission
MissionController.route('/:id([a-z0-9]{24})/activitesActives')
	.get(async (req, res) => {
		const id = req.params.id;

		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}

		try {
			const mission = await service.find(new Types.ObjectId(id));
			if (!mission) {
				return res.status(404).json({ error: 'Mission non trouvée.' });
			}

			const activityIds = mission.activites || [];
			const activities = await Promise.all(
				activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
			);

			// Filter activities to only include those with visible === true
			const activeActivities = activities.filter(activity => activity.active === true);
			return res.status(200).json(activeActivities);
		} catch (error) {
			console.error('Error fetching mission visible activities:', error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	});
	
// Toutes les activités GUIDEES dans une mission
MissionController.route('/:id([a-z0-9]{24})/activitesGuidees')
	.get(async (req, res) => {
		const id = req.params.id;
	
		if (!id) {
			return res.status(400).send('Le champ ID est manquant.');
		}
	
		try {
			const mission = await service.find(new Types.ObjectId(id));
			if (!mission) {
				return res.status(404).json({ error: 'Mission non trouvée.' });
			}
	
			const activityIds = mission.activites || [];
			const activities = await Promise.all(
				activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
			);
	
			// Filter activities to only include those with visible === true
			const guideeActivities = activities.filter(activity => activity?.guidee === true);
			return res.status(200).json(guideeActivities);
		} catch (error) {
			console.error('Error fetching mission visible activities:', error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	});


// Get VISUEL MISSION 
MissionController.route('/:id([a-z0-9]{24})/visuel')
	.get(async (req, res) => {
		const missionId = req.params.id;
		const mission = await service.find(new Types.ObjectId(missionId));

		try {		
			
			if (!mission) {
				return res.status(404).json({ message: 'La mission est introuvable'});
			} else  {
				console.log(' mission inctrl/visuel', mission );
				const visuel = await service.visuel(mission._id);
				console.log('visue', visuel);
				if (visuel === null) {
					console.log('ca opass ici');
					return res.sendFile(join(config.ATTACHEMENT_SRC, 'mission-visuel-default.jpg')); 
				}
				if (visuel) {
					return res.sendFile(join(config.ATTACHEMENT_SRC, 'VISUEL-MISSIONS', 'images' , visuel.name));	
				}

			}
		}
		 catch (error) {
			console.error('Erreur au telechargment du visuel d la mission:', error);
			return res.status(500).json({ message: 'Erreur Interne du server' });
		}
	});


// Création d'un objet multer Storage
const fileStorage = multer.diskStorage({
	// définit le dossier de destination à partir de l'ID de l'utilisateur
	destination: function(req, file, cb) {
		
		const extension = extname(file.originalname);

		try {
			const folder = getFileTypeByExtension(extension);
			req.body.type = folder;
			const dest = join(config.ATTACHEMENT_SRC,'VISUEL-MISSIONS', folder + 's');
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

	// CHANGE VISUEL MISSION 
MissionController.route('/:idMission([a-z0-9]{24})/change-visuel')
	.post(fileUpload.single('file'), async (req, res, next) => {
		try {
			const missionId = new Types.ObjectId(req.params.idMission);
			const mission = await service.find(missionId);
	
			if (!mission) {
				return res.status(404).send('Mission not found');
			}
			console.log('mission', mission);
			const room = mission.roomId;
	
			if (!room) {
				return res.status(400).send('Room ID not found in mission');
			}
			console.log('rooom', room);

			const researchedRoom = await roomService.findById(room);
	
			if (!researchedRoom) {
				return res.status(404).send('Room not found');
			}
	
			const userId = researchedRoom.moderatorId;
			console.log('userId', userId);
	
			if (!req.file) {
				return res.status(400).send('No file uploaded');
			}
	
			// Create media with the uploaded file
			const createdVisuel = await mediaService.create(userId, req.body);

			mission.visuel = createdVisuel._id;
			console.log('mission.visuel',mission.visuel);

			await mission.save();	
			return res.status(201).json(createdVisuel);
	
		} catch (err) {
			next(err);
		}
	});

	//  GESTION DES ETATS 
	// QUEL ETAT POUR UN USER
MissionController.route('/:missionId([a-z0-9]{24})/etat/:userId([a-z0-9]{24})/') 
	.get(async (req, res) => {
		const missionId = new Types.ObjectId(req.params.missionId);
		const userId = new Types.ObjectId(req.params.userId);
		const user = await userService.find(userId);
		const mission = await service.find(missionId);
		console.log('userid',user);
		if (user === null)
			{return res.status(404).send('Le participant est introuvable');}
		else {
			if (mission === null)
				{return res.status(404).send('La mission est introuvable');}
			else {
		try {
			const etatByUser = await service.etatByUser(missionId, userId);
			if (Object.values(EEtat).includes(etatByUser)) {
				return res.status(200).send(etatByUser);
			} else {
				return res.status(200).send(etatByUser);
			}
		} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	}}
	});

	// ROUTE INSCRIRE  POUR UN USER DANS UNE MISSION ======= INSCRIPTION ==============
MissionController.route('/:missionId([a-z0-9]{24})/inscrire/:userId([a-z0-9]{24})/') 
.post(async (req, res) => {
	try {
		const missionId = new Types.ObjectId(req.params.missionId);
		const userId = new Types.ObjectId(req.params.userId);
		const user = await userService.find(userId);
		const mission = await service.find(missionId);
		console.log('userid',user);
		if (user === null)
			{return res.status(404).send('Le participant est introuvable');}
		else {
			if (mission === null)
				{return res.status(404).send('La mission est introuvable');}
			else {
		// S assurer que le userId n est pas déjà dans les etats
		const isInEtat = await service.etatByUser(missionId, userId);
		if (isInEtat === 'NON_DEMARREE' || isInEtat === 'EN_COURS' || isInEtat === 'TERMINEE') {
			console.log('User déjà in array', isInEtat );
			return res.status(500).send(`Ce participant est déjà inscrit à cette mission. État d'avancement: ${isInEtat}`);

		} else {
			const actvityEtatNonDem = await service.inscriptionMission(missionId, userId);
			if (actvityEtatNonDem)
			{return res.status(200).send(actvityEtatNonDem);}
		}
		}
	}
	} catch (error) {
		console.error(error);
		return res.status(500).send('Internal Server Error');
	}
});
	// ROUTE INSCRIRE  POUR TOUS LES PARTICIPANTS D UNE SALLE A UNE MISSION ======= INSCRIPTION SALLE ENTIERE ==============
MissionController.route('/:missionId([a-z0-9]{24})/inscrireRoom/') 
	.post(async (req, res) => {
        try {
            const missionId = new Types.ObjectId(req.params.missionId);
			const mission = await service.findById(missionId);
			if (!mission) {
				return res.status(404).send('Mission introuvable.');
			}
			const roomId = mission?.roomId;

            if (roomId) {
				const room = await roomService.findById(roomId);
				if (!room) {
					return res.status(404).send('Room non trouvée.');
				}
			
				const participants = room.participants || [];
				const results = [];

				for (const userId of participants) {
						const userObjectId = new Types.ObjectId(userId);
						
						// S assurer que le participant n est pas déjà inscrit à la mission (ie est présent dans larray etat)
						const isInEtat = await service.etatByUser(missionId, userObjectId);
					if (Object.values(EEtat).includes(isInEtat)) {
						results.push({ userId, message: `Ce participant est déjà inscrit à cette mission. État d'avancement: ${isInEtat}` });
						} else {
							const inscription = await service.inscriptionMission(missionId, userObjectId);
							if (inscription) {
								results.push({ userId, message: 'Inscription réussie' });
							} else {
								console.log('AAA');
								results.push({ userId, message: 'Erreur lors de l\'inscription' });
							}
						}
					}
					return res.status(200).json(results);
				}
			} catch (error) {
				console.error(error);
				return res.status(500).send('Internal Server Error');
			}
		});

	// ROUTE MISSION EN COURS POUR UN USER ====== START =====
// Passage de l UserId de  état["NON_DEMARREE": {userId}] à  état["EN_COURS": {userId}] 
MissionController.route('/:missionId([a-z0-9]{24})/start/:userId([a-z0-9]{24})/')
.post(async (req, res) => {
	try {
		const missionId = new Types.ObjectId(req.params.missionId);
		const userId = new Types.ObjectId(req.params.userId);
		const user = await userService.find(userId);
		const mission = await service.find(missionId);

		if (user === null)
				{return res.status(404).send('Le participant est introuvable');}
			else {
				if (mission === null)
					{return res.status(404).send('La mission est introuvable');}
				else {
				// S assurer que le userId n est pas déjà dans les etats
				const isInEtat = await service.etatByUser(missionId, userId);
				console.log('Isinetat',isInEtat);
				if (isInEtat === 'EN_COURS') {
					console.log('User déjà in array', isInEtat );
					return res.status(500).send('Mission déjà en cours pour ce participant');

				} else  if (isInEtat === 'TERMINEE'){
					console.log('User déjà in array', isInEtat );
					return res.status(500).send('Mission déjà terminée pour ce participant');

				} else  if (isInEtat === 'NON_DEMARREE') {
					const missionEnCoursPourUser = await service.startMission(missionId, userId);
					if (missionEnCoursPourUser)
					{return res.status(200).send(missionEnCoursPourUser);}
				}
				else return res.status(500).send('Le participant n a jamais été inscrit à la mission');
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send('Internal Server Error');
	}
});

// ROUTE ACTIVITE TERMINEE POUR UN USER  ====== END  =====
// Passage de l UserId de  état["EN_COURS": {userId}] à  état["TERMINEE": {userId}] 
MissionController.route('/:missionId([a-z0-9]{24})/end/:userId([a-z0-9]{24})/')
	.post(async (req, res) => {
		try {
			const missionId = new Types.ObjectId(req.params.missionId);
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			const mission = await service.find(missionId);
			console.log('userid',user);
			if (user === null)
				{return res.status(404).send('Le participant est introuvable');}
			else {
				if (mission === null)
					{return res.status(404).send('La mission est introuvable');}
				else {
				// S assurer que le userId n est pas déjà dans les etats
				const isInEtat = await service.etatByUser(missionId, userId);
				console.log('Isinetat',isInEtat);
				if (isInEtat === 'NON_DEMARREE') {
					console.log('Le participant n a pas commencé la mission.');
					return res.status(500).send('Mission jamais commencée pour ce participant');

				} else  if (isInEtat === 'TERMINEE'){
					console.log('User déjà in array', isInEtat );
					return res.status(500).send('Mission déjà terminée pour ce participant');

				} else  if (isInEtat === 'EN_COURS') {
					const missionTermineePourUser = await service.endMission(missionId, userId);
					if (missionTermineePourUser)
					{return res.status(200).send(missionTermineePourUser);}
				}
				else return res.status(500).send('Le participant n a jamais été inscrit à la mission');
				}
			}
			} catch (error) {
			console.error(error);
			return res.status(500).send('Internal Server Error');
		}
	});

export default MissionController;