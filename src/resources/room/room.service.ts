import  Room  from '~/db/room.model';
import { Types } from 'mongoose';


import { IRoom } from '~~/types/room.interface';

export class RoomService {
    // Creation d une nouvelle salle

	static async create(data: IRoom): Promise<IRoom> {
		const newRoom: IRoom = {
            ...data, 
		};

		console.log('room.service : nouvelle salle à créer', newRoom);

		return await Room.create(newRoom);
	}
	
	// Met à jour une salle en particulier
	static async update(roomData: Partial<IRoom>, _id: Types.ObjectId): Promise<IRoom | null> {
		const modifiedRoom = await Room.findByIdAndUpdate(_id, roomData, { new: true });
		console.log('room service update');
		console.log(await Room.findOne(_id));
		return modifiedRoom;
	}
	
	static async findByCode(roomCode: string): Promise<IRoom | null> {
		console.log('roomCode in service', roomCode);
		const researchedRoom = await Room.findOne({ roomCode});
		console.log('researchedromm',researchedRoom);
		return researchedRoom;
	}

	 async findById(_id: Types.ObjectId): Promise<IRoom | null> {
		const researchedRoom = await Room.findOne({ _id});
		return researchedRoom;
	}

	// Trouve tous les salles
	static async findAll(): Promise<IRoom[]> {
		const allRoom = await Room.find();
		return allRoom;
	}

}


