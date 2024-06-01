import  Mission  from '~/db/mission.model';
import { IMission } from '~~/types/mission.interface';
import { Types } from 'mongoose';
import { config } from '~/config';
import { NotFoundException } from '~/utils/exceptions';
import { RoomService } from '../room/room.service';
import { IRoom } from '~~/types/room.interface';
import  Room  from '~/db/room.model';

export class MissionService {

    // Creation d une nouvelle mission

	static async createMission(roomId: Types.ObjectId, datas: IMission): Promise<IMission> {
		const newMission: IMission = {
			...datas,
			roomId: roomId
		};
		return await Mission.create(newMission);
	}

	// Trouve une mission en particulier
	async find(_id: Types.ObjectId): Promise<IMission | null> {
		const researchedMission = await Mission.findById(_id);
		return researchedMission;
	}


	// Trouve toutes les missions
	async findAll(): Promise<IMission[]> {
		try {
            const missionList = await Mission.find();
            return missionList;
        } catch (error) {
            console.error('Error finding missions:', error);
            throw error;
        }		
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
			console.error('Error finding missions:', error);
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
			console.error('Error finding missions:', error);
			throw error;
		}	
	};
}


