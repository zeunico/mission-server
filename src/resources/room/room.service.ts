import  Room  from '~/db/room.model';
import { Types } from 'mongoose';


import { IRoom } from '~~/types/room.interface';
import { InstanceService } from '../instance/instance.service';

const instanceService = new InstanceService();

export class RoomService {
    // Creation d une nouvelle salle
	async create(data: IRoom): Promise<IRoom> {
		const newRoom: IRoom = {
            ...data, 
		};

		console.log('room.service : nouvelle salle à créer', newRoom);

		return await Room.create(newRoom);
	}
	// Creation d une nouvelle salle avec un roomcode donné  
	async  createNewRoom(roomCode: string): Promise<IRoom | undefined> {
		try {
		const roomData: IRoom = {
			_id: new Types.ObjectId(),
			moderatorId: new Types.ObjectId(),
			roomCode: roomCode,
			participants: [],
			mission: []
			};
		const createdRoom = await this.create(roomData);
		console.log('Created Room:', createdRoom);
		return createdRoom;
		} catch (error) {
		  console.error('Error creating room:', error);
		}
	  }
	
	// Met à jour une salle en particulier
	async update(roomData: Partial<IRoom>, _id: Types.ObjectId): Promise<IRoom | null> {
		const modifiedRoom = await Room.findByIdAndUpdate(_id, roomData, { new: true });

		return modifiedRoom;
	}
	
	/// ATTENTION findByCode  NE FCTINNE QUE POUR UNE INSTANCE UNIQUE
	async findByCode(roomCode: string): Promise<IRoom | null> {
		console.log('roomCode in service', roomCode);
		const researchedRoom = await Room.findOne({roomCode});
		return researchedRoom;
	}
	
	// Trouve la ROOM selon le code de la salle et le nom de l'instance
	async findByCodeAndInstance(roomCode: string, instanceName: string): Promise<IRoom | null> {
    console.log('roomCode in service', roomCode);

    // Toutes les salles avec le même ROOMCODE
    const arrayRoomSameCode = await Room.find({ roomCode });
    if (!arrayRoomSameCode.length) {
        return null; 
    }

    // Array des roomId des salles avec le même ROOMCODE TO STRING pour comparaison
    const roomIds = arrayRoomSameCode.map(room => room._id.toString());

    // L'instance par son nom
    const instance = await instanceService.findByName(instanceName);
    if (!instance) {
        return null;
    }

    // Array des roomsId dans l"instance TO STRING pour comparaison 
    const instanceRoomIds = instance.rooms.map(room => room.toString());

    // Comparaison
    const researchedRoom = arrayRoomSameCode.find(room => instanceRoomIds.includes(room._id.toString()));

    return researchedRoom || null; 
}


	// Trouve le ROOMCODE selon l ID de la room
	async findCodeById(_id: Types.ObjectId): Promise<String | undefined> {
		console.log('roomCode by Id', _id);
		const researchedRoom = await Room.findOne({_id});
		const reserchedCode = researchedRoom?.roomCode;
		return reserchedCode;
	}

	// Une salle par son ID
	async findById(_id: Types.ObjectId): Promise<IRoom | null> {
		const researchedRoom = await Room.findOne({_id});
		return researchedRoom;
	}

	// Trouve tous les salles
	async findAll(): Promise<IRoom[]> {
		const allRoom = await Room.find();
		return allRoom;
	}

}