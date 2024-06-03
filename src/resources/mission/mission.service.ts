import  Mission  from '~/db/mission.model';
import { IMission } from '~~/types/mission.interface';
import { Types } from 'mongoose';
import { config } from '~/config';
import { NotFoundException } from '~/utils/exceptions';
import { RoomService } from '../room/room.service';
import { IRoom } from '~~/types/room.interface';
import  Room  from '~/db/room.model';
import RoomController from '../room/room.controller';

export class MissionService {

    // Creation d une nouvelle mission

	static async createMission(roomId: Types.ObjectId, datas: IMission): Promise<IMission> {
		const newMission: IMission = {
			...datas,
			roomId: roomId
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
	// Supprimme une mission par son ID
	async delete(missionId: Types.ObjectId): Promise<IMission | null> {
		console.log('missionId', missionId);
		const deletedMission = await Mission.findByIdAndDelete(missionId);
		return deletedMission;
	}

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
	};
}


