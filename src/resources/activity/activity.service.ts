import { Types } from 'mongoose';
import Activity  from '~/db/activity.model';
import ActivityConsulter   from '~/db/activity.model';
import  ActivityProduire from '~/db/activity.model';
import { IActivity } from '~~/types/activity.interface';
import { IActivityConsulter } from '~~/types/activity.interface';
import { IActivityProduire } from '~~/types/activity.interface';
import { MissionService } from '../mission/mission.service';
import { RoomService } from '../room/room.service';
import EEtat from '~~/types/etat.enum';


const missionService = new MissionService();
const roomService = new RoomService();


export class ActivityService {
	// Création d une activité !!! HORS CLASS PRODUIRE OU CONSULTER // PAS DE CHAMP TYPE OU decription_detailleee_.....
	async create(data:IActivity): Promise<IActivity> {
		const newActivity: IActivity = {

			...data,
		};
		console.log('new act in create', newActivity);
		return  Activity.Activity.create(newActivity);
	}

	// Trouve tous les activités (produire et consulter confondues)
	async findAll(): Promise<IActivity[]> {
		const consulterActivities = await ActivityConsulter.Activity.find();
		const produireActivities = await ActivityProduire.Activity.find();
		const allActivities = consulterActivities.concat(produireActivities);
		return allActivities;
	}

	// Trouve une activite par son ID
	async find(_id: Types.ObjectId): Promise<IActivity | null> {
		const researchedActivity = await Activity.Activity.findById(_id);
		return researchedActivity;
	}
	
	async findById(_id: Types.ObjectId): Promise<IActivity | null> {
		const researchedActivity = await Activity.Activity.findOne({ _id});
		return researchedActivity;
	}

	// Supprimme une mission par son ID
	async delete(activityId: Types.ObjectId): Promise<IActivity | null> {
		console.log('activityId', activityId);
		const deletedActivity = await Activity.Activity.findByIdAndDelete(activityId);
		return deletedActivity;
	}

	// Statut Visible de l'activité
	async findVisibilityStatus(activityId: Types.ObjectId): Promise<boolean> {
		try {
			const activity = await Activity.Activity.findById(activityId);
			if (!activity) {
				throw new Error('Activité introuvable');
			} else {
				return activity.visible;
			}
		} catch (error) {
			console.error('Erreur lors de la recherche de l\'activité:', error);
			throw error;
		}	
	}



	// GESTION DES ETATS
	
	// ETAT d un USER dans une activité
	async etatByUser(activityId: Types.ObjectId, userId: Types.ObjectId): Promise<String> {
				let foundKey = null;
				const activity = await Activity.Activity.findById(activityId);	
					// Iterate over each key-value pair in activity.etat
					for (const [key, value] of activity.etat.entries()) {
					// Check if userId exists in the array associated with the current key
						if (value.includes(userId)) {
							foundKey = key; 
						}
					}
					if (foundKey !== null) {
						return foundKey;
					}
					else return 'Cet utilisateur n a pas été inscrit à l activité';
	}
	// AJOUT DE l'USERID A L ARRAY NON_DEMARREE DANS LES ETATS DE L ACTIVITE
    async inscriptionActivity(activityId: Types.ObjectId, userId: Types.ObjectId): Promise<IActivity | null> {
		const activity = await Activity.Activity.findById(activityId);
		if (activity) {
			console.log('activite',activity);
			// Ajout du userId a l' array NON_DEMARREE
			activity.etat.set("NON_DEMARREE", activity.etat.get("NON_DEMARREE").concat(userId));
			activity.save();
			return activity;}
		else return null;
	}


	// PASSAGE DE l'USERID DE NON_DEMARREE A EN_COURS DANS LES ETATS DE L ACTIVITE
	async startActivity(activityId: Types.ObjectId, userId: Types.ObjectId): Promise<IActivity | null> {
		const activity = await Activity.Activity.findById(activityId);
		if (activity) {
			console.log('activiteyy',activity);
			// Ajout du userId a l' array EN_COURS
			activity.etat.set("EN_COURS", activity.etat.get("EN_COURS").concat(userId));   
			activity.etat.set("NON_DEMARREE", activity.etat.get("NON_DEMARREE").filter((id: Types.ObjectId) => !id.equals(userId)));
			activity.save();
			return activity;}
		else return null;
	}

	// PASSAGE DE l'USERID DE NON_DEMARREE A EN_COURS DANS LES ETATS DE L ACTIVITE
	async endActivity(activityId: Types.ObjectId, userId: Types.ObjectId): Promise<IActivity | null> {
		const activity = await Activity.Activity.findById(activityId);
		if (activity) {
			console.log('activiteyy',activity);
			// Ajout du userId a l' array EN_COURS
			activity.etat.set("TERMINEE", activity.etat.get("TERMINEE").concat(userId));   
			activity.etat.set("EN_COURS", activity.etat.get("EN_COURS").filter((id: Types.ObjectId) => !id.equals(userId)));
			activity.save();
			return activity;}
		else return null;
	}


	// INSCRIPTION PAR ROUTINE POUR INSCRIPTION ROOM ENTIERE// Function to register participants to a specific activity
	async registerParticipantsToActivity(activityId: Types.ObjectId, roomId: Types.ObjectId): Promise<void> {
		try {
			// Retrieve mission for the activity
			const mission = await missionService.findMissionByActivity(activityId);
			if (!mission) {
				console.log(`Mission not found for activity ${activityId}`);
				return;
			}

			// Retrieve room participants
			const room = await roomService.findById(roomId);
			if (!room) {
				console.log(`Room not found for activity ${activityId}`);
				return;
			}
			const participants = room.participants || [];

			const results = [];

			for (const userId of participants) {
				const userObjectId = new Types.ObjectId(userId);

				// Ensure the user is not already in the states
				const isInEtat = await this.etatByUser(activityId, userObjectId);
				if (Object.values(EEtat).includes(isInEtat)) {
					results.push({ userId, message: `Ce participant est déjà inscrit à cette activité. État d'avancement: ${isInEtat}` });
				} else {
					const inscription = await this.inscriptionActivity(activityId, userObjectId);
					if (inscription) {
						results.push({ userId, message: 'Inscription réussie' });
					} else {
						results.push({ userId, message: 'Erreur lors de l\'inscription' });
					}
				}
			}

			console.log(`Processed activity ${activityId} for room ${roomId}:`, results);
		} catch (error) {
			console.error(`Error registering participants to activity ${activityId} for room ${roomId}:`, error);
			throw error; // Optionally re-throw the error to propagate it upwards
		}
	};


	// Statut Activité de l'activité
	async findActiveStatus(activityId: Types.ObjectId): Promise<boolean> {
		try {
			const activity = await Activity.Activity.findById(activityId);
			if (!activity) {
				throw new Error('Activité introuvable');
			} else {
				return activity.active;
			}
		} catch (error) {
			console.error('Erreur lors de la recherche de l\'activité:', error);
			throw error;
		}
	}

	// Statut Guidée de l'activité
	async findGuideeStatus(activityId: Types.ObjectId): Promise<boolean> {
		try {
			const activity = await Activity.Activity.findById(activityId);
			if (!activity) {
				throw new Error('Activité introuvable');
			} else {
				return activity.guidee;
			}
		} catch (error) {
			console.error('Erreur lors de la recherche de l\'activité:', error);
			throw error;
		}
	}

	// Titre de l'activité par ID de l'activité
	async findTitreById(activityId: Types.ObjectId): Promise<IActivity["titre"]> {
		try {
			const activity = await Activity.Activity.findById(activityId);
			if (!activity) {
				throw new Error('Activité introuvable');
			}
			const titre = activity.titre;
			return titre;
		} catch (error) {
			console.error('Erreur lors de la recherche de l\'activité:', error);
			throw error;
		}
	}

}


export class ActivityConsulterService extends ActivityService {	
	// Création d une activité CONSULTER
	static async createConsulter(data:IActivityConsulter): Promise<IActivityConsulter | undefined> {
		console.log('data', data);
		if (!data.type && !data.description_detaillee_consulter){	
			super.create(data);
		}else {
			console.log('data.type', data.type);
			const newActivityConsulter: IActivityConsulter = {
				...data,
				type: data.type,
				description_detaillee_consulter: data.description_detaillee_consulter
			};
		console.log('new act in createCONSULTER via  ...', newActivityConsulter);
		return  ActivityConsulter.ActivityConsulter.create(newActivityConsulter);
		};
	}
		
	// Trouve tous les activités CONSULTER
	static async findAll(): Promise<IActivityConsulter[]> {
		const allActivitiesConsulter = await ActivityConsulter.ActivityConsulter.find();
		console.log('allAct', allActivitiesConsulter);
		return allActivitiesConsulter;
	}

	// Trouve une activité CONSULTER par son ID
	static async findById(_id: Types.ObjectId): Promise<IActivityConsulter | null> {
		const researchedActivity = await ActivityConsulter.ActivityConsulter.findOne({ _id});
		return researchedActivity;
	}
	
}

export class ActivityProduireService extends ActivityService {
	// Création d une activité PRODUIRE
	static async createProduire(data:IActivityProduire): Promise<IActivityProduire | undefined> {
		console.log('data', data);
		if (!data.types && !data.description_detaillee_produire){	
			console.log('ici');
			super.create(data);
		}else {
			console.log('data.types', data.types);
			const newActivityProduire: IActivityProduire = {
				...data,
				types: data.types,
				description_detaillee_produire: data.description_detaillee_produire
			};
		console.log('new act in createProduire ds clas produire', newActivityProduire);
		return  ActivityProduire.ActivityProduire.create(newActivityProduire);
		};
	}
		
	// Trouve tous les activités PRODUIRE
	static async findAll(): Promise<IActivityProduire[]> {
		const allActivities = await ActivityProduire.ActivityProduire.find();
		console.log('allAct', allActivities);
		return allActivities;
	}
	
	// Trouve une activité PRODUIRE par son ID
	static async findById(_id: Types.ObjectId): Promise<IActivityProduire | null> {
		const researchedActivity = await ActivityConsulter.ActivityProduire.findOne({ _id});
		return researchedActivity;
	}
}