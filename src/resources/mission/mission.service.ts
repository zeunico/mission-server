import  Mission  from '~/db/mission.model';
import { IMission } from '~~/types/mission.interface';
import { IMedia } from '~~/types/media.interface';
import { Types } from 'mongoose';
import { config } from '~/config';
import { join } from 'path';
import { NotFoundException } from '~/utils/exceptions';
import { RoomService } from '../room/room.service';
import { MediaService } from '../media/media.service';
import { IRoom } from '~~/types/room.interface';
import  Room  from '~/db/room.model';
import RoomController from '../room/room.controller';
import EEtat from '~~/types/etat.enum';
import { NullLiteral } from '@swc/core';
const mediaService = new MediaService();


export class MissionService {

    // Creation d une nouvelle mission
	async createMission(datas: IMission): Promise<IMission> {
		const newMission: IMission = {
			...datas,
		};
		return await Mission.create(newMission);
	}

	// Creation d une nouvelle mission par le roomCode
	async createMissionByCode(datas: IMission, roomId: Types.ObjectId): Promise<IMission> {
		const newMission: IMission = {
			...datas,
			roomId:roomId
			
		};
		return await Mission.create(newMission);
	}

	// Trouve une mission par son ID
	async find(_id: Types.ObjectId): Promise<IMission | null> {
		const researchedMission = await Mission.findById(_id);
		return researchedMission;
	}
	// Trouve toutes les missions
	async findAll(): Promise<IMission[]> {
		const missionList = await Mission.find();
		return missionList;		
	}

	// Trouve par l ID de la mission
	async findById(_id: Types.ObjectId): Promise<IMission | null> {
		const researchedMission = await Mission.findOne({ _id});
		return researchedMission;
	}

	// Supprimme une mission par son ID
	async delete(missionId: Types.ObjectId): Promise<IMission | null> {
		console.log('missionId', missionId);
		const deletedMission = await Mission.findByIdAndDelete(missionId);
		return deletedMission;
	}

    // Statut Visible de la mission
	async findVisibilityStatus(missionId: Types.ObjectId): Promise<Boolean> {
		try {
			const mission = await Mission.findById(missionId);
			if (!mission) {
				throw new Error('Mission introuvable');
			} else {
				return mission.visible;
				}
			}
		 catch (error) {
			console.error('Erreur lors de la recherche de la mission:', error);
			throw error;
		}	
	}	

    // Statut Activité de la mission
	async findActiveStatus(missionId: Types.ObjectId): Promise<Boolean> {
		try {
			const mission = await Mission.findById(missionId);
			if (!mission) {
				throw new Error('Mission introuvable');
			} else {
				return mission.active;
				}
			}
		 catch (error) {
			console.error('Erreur lors de la recherche de la mission:', error);
			throw error;
		}	
	}

	// Statut Guidée de la mission
	async findGuideeStatus(missionId: Types.ObjectId): Promise<Boolean> {
		try {
			const mission = await Mission.findById(missionId);
			if (!mission) {
				throw new Error('Mission introuvable');
			} else {
				return mission.guidee;
				}
			}
			catch (error) {
			console.error('Erreur lors de la recherche de la mission:', error);
			throw error;
		}	
	}

	// Titre de la mission par Id de la mission
	async  findTitreByid(missionId: Types.ObjectId): Promise<IMission["titre"]> {
		try {
			const mission = await Mission.findById(missionId);
			if (!mission) {
				throw new Error('Mission introuvable');
			}
			const titre = mission.titre;
			return titre;
		} catch (error) {
			console.error('Erreur lors de la recherche de la mission:', error);
			throw error;
		}	
	}

// ETAT D'AVANCEMENT D'UNE MISSION
	// Statut Etat de la Mission
	async findEtat(missionId: Types.ObjectId): Promise<IMission["etat"]> {
		try {
			const mission = await Mission.findById(missionId);
			if (!mission) {
				throw new Error('Mission introuvable');
			} else {
				return mission.etat;
				}
			}
			catch (error) {
			console.error('Erreur lors de la recherche de la mission:', error);
			throw error;
		}	
	}

  	//  LE VISUEL DE LA MISSION 	
	  async visuel(missionId: Types.ObjectId): Promise<IMedia | null> {
		try {
			const mission = await Mission.findById(missionId);
			
			if (!mission) {
				throw new Error('Mission introuvable');
				} else 
					if (mission) {
					console.log('mission', mission);
					const mediaId = mission.visuel;
					
					if (mediaId)
						{
						console.log('mediaId', mediaId);
						const media = await mediaService.find(mediaId);
						if (media) {
							return media;
							}
						} 
					else {return null;}
				}
			}
			catch (error) {
			console.error('Erreur lors de la recherche de la mission:', error);
			throw error;
			}	
		}

	// ETAT d un USER dans une mission
	async etatByUser(missionId: Types.ObjectId, userId: Types.ObjectId): Promise<String> {
		let foundKey = null;
		const mission = await Mission.findById(missionId);	
			// Iterate over each key-value pair in activity.etat
			if (mission) {
			for (const [key, value] of mission.etat.entries()) {
			// Check if userId exists in the array associated with the current key
				if (value.includes(userId)) {
					foundKey = key; 
				}
			}
			if (foundKey !== null) {
				return foundKey;
			}
			else return '';
		}
	}	

	// AJOUT DE l'USERID A L ARRAY NON_DEMARREE DANS LES ETATS DE L ACTIVITE
	async inscriptionMission(missionId: Types.ObjectId, userId: Types.ObjectId): Promise<IMission | null> {
		const mission = await Mission.findById(missionId);
		if (mission) {
			// Ajout du userId a l' array NON_DEMARREE
			mission.etat.set("NON_DEMARREE", mission.etat.get("NON_DEMARREE").concat(userId));
			mission.save();
			return mission;}
		else return null;
	}

	// PASSAGE DE l'USERID DE NON_DEMARREE A EN_COURS DANS LES ETATS DE LA MISSION
	async startMission(missionId: Types.ObjectId, userId: Types.ObjectId): Promise<IMission | null> {
		const mission = await Mission.findById(missionId);
		if (mission) {
			// Ajout du userId a l' array EN_COURS
			mission.etat.set("EN_COURS", mission.etat.get("EN_COURS").concat(userId));   
			mission.etat.set("NON_DEMARREE", mission.etat.get("NON_DEMARREE").filter((id: Types.ObjectId) => !id.equals(userId)));
			mission.save();
			return mission;}
		else return null;
	}

	// PASSAGE DE l'USERID DE NON_DEMARREE A EN_COURS DANS LES ETATS DE L ACTIVITE
	async endMission(missionId: Types.ObjectId, userId: Types.ObjectId): Promise<IMission | null> {
		const mission = await Mission.findById(missionId);
		if (mission) {
			console.log('activiteyy',mission);
			// Ajout du userId a l' array EN_COURS
			mission.etat.set("TERMINEE", mission.etat.get("TERMINEE").concat(userId));   
			mission.etat.set("EN_COURS", mission.etat.get("EN_COURS").filter((id: Types.ObjectId) => !id.equals(userId)));
			mission.save();
			return mission;}
		else return null;
	}

	// Toutes les missions dans une room
	async findByRoomId(roomId: Types.ObjectId): Promise<IMission[]> {
        try {
            const missions = await Mission.find({ roomId }).exec();
            return missions;
        } catch (error) {
            console.error('Error in findByRoomId:', error);
            throw error;
        }
    }
}