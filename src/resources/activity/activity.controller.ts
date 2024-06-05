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
 *   summary: Récupération de toutes les activités
 *   tags: [Instructions]
 *   responses:
 *    200:
 *     description: Activités récupérées
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
 *          userTarget:
 *           type: string
 *           description: ID de l'utilisateur cible
 *          room:
 *           type: string
 *           description: Code de la salle virtuelle
 *          consigne:
 *           type: string
 *           description: Consigne donné par le formateur à l'apprenant
 *    404:
 *     description: Consignes introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 */

ActivityController.route('/')
	.get(async (req, res, next) => {
        try {
			const activityList = await ActivityService.findAll();
            return res.status(200).json(activityList);
          }
		 catch (err) {
			next(err);
		}
	});


ActivityController.route('/')
	.post(async (req, res, next) => {
		try {
	
			if (req.body.description_detaillee_consulter && req.body.type) {	   
				const savedConsulter = await ActivityConsulterService.createConsulter(req.body);
				return res.status(201).json(savedConsulter);
			} else {
				if (req.body.description_detaillee_produire && req.body.types) {

					const savedProduire = await ActivityProduireService.createProduire(req.body);
					console.log('Controller / ActivityProduire return from ActProdSer:', savedProduire);
					return res.status(201).json(savedProduire);
				}
			}
		} catch (err) {
			next(err);
		}
	});

ActivityController.route('/consulter')
	.post(async (req, res, next) => {
		try {
			const activityConsulter = await ActivityConsulterService.createConsulter(req.body);
		
			res.status(201).send(activityConsulter);
		} catch (err) {
			next(err);
		}
	})

	.get(async (req, res, next) => {
		try {
			const activityConsulterList = await ActivityConsulterService.findAll();
			res.status(200).send(activityConsulterList);
		} catch (err) {
			next(err);
		}
	});

ActivityController.route('/produire')
.post(async (req, res) => {
    try {
        const activityProduire = await ActivityProduireService.createProduire(req.body);
    
        res.status(201).send(activityProduire);
    } catch (error) {
        res.status(400).send(error);
    }
})
.get(async (req, res, next) => {
	try {
		const activityProduireList = await ActivityProduireService.findAll();
		res.json(activityProduireList);
	} catch (err) {
        next(err);
    }
});


// ROUTE ACTIVITE SELON SON ID 
ActivityController.route('/:id([a-z0-9]{24})/')
.get(async (req, res, next) => {
	try {
		const id = new Types.ObjectId(req.params.id);
		
		const room = await ActivityService.findById(id);
	
		return res.status(200).json(room);
	} catch (err) {
		next(err);
	}
});


// POST ET DELETE UNE  ACTIVITE A UNE MISSION

ActivityController.route('/addMission/:idActivity([a-z0-9]{24})/:idMission([a-z0-9]{24})')
.post(async (req, res) => {
    try {
        const idActivity = req.params.idActivity;
        const idMission = req.params.idMission;

        const activity = await ActivityService.findById(new Types.ObjectId(idActivity));
        if (!activity) {
            return res.status(404).json({ error: `Activité avec ID ${idActivity} non trouvée` });
        }

        const mission = await Mission.findById(new Types.ObjectId(idMission));
        if (!mission) {
            return res.status(404).json({ error: `Mission avec ID ${idMission} non trouvée` });
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

        const activity = await ActivityService.findById(new Types.ObjectId(idActivity));
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

        // On retire l'activité car elle n'existe pas déjà 
		mission.activites = mission.activites.filter(id => !id.equals(activity._id));
        mission.nb_activites -= 1;
        
        await mission.save();
        
        return res.status(200).json(mission);
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
            const activitytodup = await ActivityService.findById(new Types.ObjectId(idActivity));
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

export default ActivityController;