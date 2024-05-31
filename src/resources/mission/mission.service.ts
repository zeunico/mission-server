import  Mission  from '~/db/mission.model';
import { IMission } from '~~/types/mission.interface';
import { Types } from 'mongoose';
import { config } from '~/config';
import { NotFoundException } from '~/utils/exceptions';

export class MissionService {

    // Creation d une nouvelle mission

	async create(data: IMission): Promise<IMission> {
		const newMission: IMission = {
            ...data, 
		};

		console.log('mission.service : nouvelle mission créée', newMission);

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


}


