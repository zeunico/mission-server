import { Router } from 'express';
import { Types } from 'mongoose';
import { MissionService } from '../mission/mission.service';
import { ActivityService } from '../activity/activity.service';
import { MediaService } from '../media/media.service';
import { RoomService } from '../room/room.service';
import { IMission } from '~~/types/mission.interface';
import { extname, join } from 'path';
import fs from 'fs';
import { config } from '~/config';
import multer from 'multer';
import { getFileTypeByExtension, getFileNameFormatted } from '~/utils/file.utils';


// Création d'un Router Express
const MissionController: Router = Router();

// Instanciation des Services

const service = new MissionService();
const roomService = new RoomService();
const missionService = new MissionService();
const mediaService = new MediaService();
const activityService = new ActivityService();

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
 * get:
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
 *          description: Activité de la mission
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
 *     description: Ce point de terminaison change l'état de l'activité d'une mission en active.
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
 * /mission/{id}/start:
 *   post:
 *     summary: Démarrer une mission Etat NON_DEMARREE => EN_COURS
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état d'avancement d'une mission de "non démarrée" à "en cours".
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
 *         description: La mission a démarrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est démarrée
 *       400:
 *         description: La mission est déjà démarrée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: La mission est déjà démarrée
 *       404:
 *         description: La mission est introuvable
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: La mission est introuvable
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Erreur interne du serveur
  * /mission/{id}/end:
 *   post:
 *     summary: Commencer une mission Etat EN_COURS => TERMINEE
 *     tags: [Mission]
 *     description: Ce point de terminaison change l'état d'avancement d'une mission de "en cours" à "terminée".
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
 *         description: La mission a terminée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Mission {titre} est terminée 
 *       400:
 *         description: La mission est déjà terminée
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: La mission est déjà terminée
 *       404:
 *         description: La mission est introuvable
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: La mission est introuvable
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Erreur interne du serveur
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
 */

// ROUTE RACINE LISTE TOUTES LES MISSIONS
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
// GET MISSION DANS UNE SALLE PAR UN ROOMCODE  
MissionController.route('/:roomCode([A-Z-z0-9]{6})/')
	.post(async (req, res, next) => {
		try {
			const room = await RoomService.findByCode(req.params.roomCode);
			if (room) {
				const roomId = room._id;
				const mission = await MissionService.createMission(roomId, req.body);
				console.log('room',room);console.log('roomId',roomId);console.log('mission',mission);
				room?.mission.push(mission._id);	
				await room.save();
				console.log('mission', mission);
				
				return res.status(201).json(mission);}		
		}
		catch (err) {
			console.error('Error in POST /missions/roomCode:');
			next(err);
		}
	})
	.get(async (req, res, next) => {
		try {
			const room = await RoomService.findByCode(req.params.roomCode);
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
				const room = await RoomService.findById(mission.roomId);
				console.log('room', room);
				if (room) {
					room.mission = room.mission.filter(id => !id.equals(mission._id));


					await room.save();
				}
				return res.status(200).json(mission);
			} catch (error) {
				console.error('Error in DELETE /missions/id:', error);
				return res.status(500).json({ message: 'Erreur du serveur' });
			}
		}
	);

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
				res.status(200).json('Mission :  ' + titre + ' est déjà visible');
			} else {
				if (mission) {
					mission.visible = true;
					await mission.save();
				res.status(201).json('Mission :  ' + titre + ' est désormais visible');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
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
				res.status(200).json('Mission :  ' + titre + ' est déjà non visible');
			} else {
				if (mission) {
					mission.visible = false;
					await mission.save();
					res.status(201).json('Mission :  ' + titre + ' est désormais non visible');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
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
				res.status(200).json('Mission :  ' + titre + ' est déjà active');
			} else {
				if (mission) {
					mission.active = true;
					await mission.save();
				res.status(201).json('Mission :  ' + titre + ' est désormais active');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
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
				res.status(200).json('Mission :  ' + titre + ' est déjà non active');
			} else {
				if (mission) {
					mission.active = false;
					await mission.save();
					res.status(201).json('Mission :  ' + titre + ' est désormais non active');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
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
				res.status(200).json('Mission :  ' + titre + ' est déjà guidée');
			} else {
				if (mission) {
					mission.guidee = true;
					await mission.save();
				res.status(201).json('Mission :  ' + titre + ' est désormais guidée');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
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
				res.status(200).json('Mission :  ' + titre + ' est déjà non guidée');
			} else {
				if (mission) {
					mission.guidee = false;
					await mission.save();
					res.status(201).json('Mission :  ' + titre + ' est désormais non guidée');
				}
			} 	
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
		}
	});

// TOUTES LES ID DES ACTIVITES DANS LA MISSION
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
                res.status(200).json(activityList);
            } else {
                res.status(404).json('Mission non trouvée.');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json('Internal Server Error');
        }
    });

// TOUTES LES ACTIVITES OBJETS DANS LA MISSION
MissionController.route('/:id([a-z0-9]{24})/activites')
    .get(async (req, res) => {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send('Le champ ID est manquant.');
        }
        try {
            const mission = await missionService.find(new Types.ObjectId(id));
            if (!mission) {
                return res.status(404).json({ error: 'Mission non trouvée.' });
            }

            const activityIds = mission.activites || [];
            const activities = await Promise.all(
                activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
            );

            res.status(200).json(activities);
        } catch (error) {
            console.error('Error fetching mission activities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
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
            const mission = await missionService.find(new Types.ObjectId(id));
            if (!mission) {
                return res.status(404).json({ error: 'Mission non trouvée.' });
            }

            const activityIds = mission.activites || [];
            const activities = await Promise.all(
                activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
            );

            // Filter activities to only include those with visible === true
            const visibleActivities = activities.filter(activity => activity.visible === true);
            res.status(200).json(visibleActivities);
        } catch (error) {
            console.error('Error fetching mission visible activities:', error);
            res.status(500).json({ error: 'Internal Server Error' });
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
		const mission = await missionService.find(new Types.ObjectId(id));
		if (!mission) {
			return res.status(404).json({ error: 'Mission non trouvée.' });
		}

		const activityIds = mission.activites || [];
		const activities = await Promise.all(
			activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
		);

		// Filter activities to only include those with visible === true
		const activeActivities = activities.filter(activity => activity.active === true);
		res.status(200).json(activeActivities);
	} catch (error) {
		console.error('Error fetching mission visible activities:', error);
		res.status(500).json({ error: 'Internal Server Error' });
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
			const mission = await missionService.find(new Types.ObjectId(id));
			if (!mission) {
				return res.status(404).json({ error: 'Mission non trouvée.' });
			}
	
			const activityIds = mission.activites || [];
			const activities = await Promise.all(
				activityIds.map(activityId => activityService.find(new Types.ObjectId(activityId)))
			);
	
			// Filter activities to only include those with visible === true
			const guideeActivities = activities.filter(activity => activity?.guidee === true);
			res.status(200).json(guideeActivities);
		} catch (error) {
			console.error('Error fetching mission visible activities:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	});
// DEMARRER UNE MISSION ETAT 0 => 1 
MissionController.route('/:id([a-z0-9]{24})/start')
	.post(async (req, res) => {
		const missionId = req.params.id;
		const mission = await service.find(new Types.ObjectId(missionId));

		try {		
			
			if (!mission) {
				return res.status(404).json({ message: 'La mission est introuvable' });
			} else if (mission.etat === "EN_COURS") {
				return res.status(400).json({ message: 'La mission est déjà démarrée', mission });
			} else if (mission.etat === "TERMINEE") {
				return res.status(400).json({ message: 'La mission est terminée, vous le pouvez pas la redémarrer', mission });
			} else {  
				mission.etat = "EN_COURS";
				await mission.save();
				return res.status(200).json({ message: 'La mission a démarrée avec succès', mission });
			}
		}
		 catch (error) {
			console.error('Erreur au démarrage de la mission:', error);
			return res.status(500).json({ message: 'Erreur Interne du server' });
		}
	});

// TERMINER UNE MISSION ETAT 1 => 2 
MissionController.route('/:id([a-z0-9]{24})/end')
	.post(async (req, res) => {
		const missionId = req.params.id;
		const mission = await service.find(new Types.ObjectId(missionId));

		try {		
			
			if (!mission) {
				return res.status(404).json({ message: 'La mission est introuvable'});
			} else if (mission.etat === "TERMINEE") {
				return res.status(400).json({ message: 'La mission est déjà terminée', mission });
			} else if (mission.etat === "NoN_DEMARREE") {
				return res.status(400).json({ message: 'Par où t passé !! Cette mission n a jamais été démarrée !', mission });
			} else {  
				mission.etat = "TERMINEE";
				await mission.save();
				return res.status(200).json({ message: 'La mission a été terminée avec succès', mission });
			}
		}
		 catch (error) {
			console.error('Erreur au démarrage de la mission:', error);
			return res.status(500).json({ message: 'Erreur Interne du server' });
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
					res.sendFile(join(config.ATTACHEMENT_SRC, 'mission-visuel-default.jpg')); 
				}
				if (visuel) {
					res.sendFile(join(config.ATTACHEMENT_SRC, 'VISUEL-MISSIONS', 'images' , visuel.name));	
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
			const mission = await missionService.find(missionId);
	
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

export default MissionController;