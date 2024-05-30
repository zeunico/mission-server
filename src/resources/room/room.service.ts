import  Room  from '~/db/room.model';
import { Types } from 'mongoose';


import { IRoom } from '~~/types/room.interface';

export class RoomService {
    // Creation d une nouvelle salle

	static async create(data: IRoom): Promise<IRoom> {
		const newRoom: IRoom = {
            ...data, 
		};

		console.log('room.service : nouvelle salle créée', newRoom);

		return await Room.create(newRoom);
	}
	
	static async findByCode(roomCode: string): Promise<IRoom | null> {
		const researchedRoom = await Room.findOne({ roomCode});
		return researchedRoom;
	}

	static async findById(roomId: string): Promise<IRoom | null> {
		const researchedRoom = await Room.findOne({ roomId});
		return researchedRoom;
	}
}


