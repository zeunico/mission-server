import  Instance  from '~/db/instance.model';
import { Types } from 'mongoose';
import { IInstance } from '~~/types/instance.interface';

export class InstanceService {


	// Creation d une nouvelle salle par NOM

	static async createInstanceByName(instanceName) {
		try {
		const instanceData: IInstance = {
		  _id: new Types.ObjectId(),
		  name: instanceName,
		  rooms: [new Types.ObjectId]
		};
		const createdInstance = await InstanceService.create(instanceData);
		console.log('Created Instance :', createdInstance);
		} catch (error) {
		  console.error('Error creating room:', error);
		}
	  }


    // Creation d une nouvelle salle

	static async create(data: IInstance): Promise<IInstance> {
		const newInstance: IInstance = {
            ...data, 
		};

		console.log('instance .service : nouvelle instance à créer', newInstance);

		return await Instance.create(newInstance);
	}
	
	// Met à jour une instance en particulier
	static async update(instanceData: Partial<IInstance>, _id: Types.ObjectId): Promise<IInstance | null> {
		const modifiedInstance = await Instance.findByIdAndUpdate(_id, instanceData, { new: true });
		console.log('insttanec service update');
		console.log(await Instance.findOne(_id));
		return modifiedInstance;
	}
	
	static async findByName(instanceName: string): Promise<IInstance | null> {
		const researchedInstance = await Instance.findOne({ name: instanceName }).exec();
		return researchedInstance;
	}

	static async findById(_id: Types.ObjectId): Promise<IInstance | null> {
		const researchedInstance = await Instance.findOne({ _id});
		return researchedInstance;
	}

	// Trouve tous les salles
	static async findAll(): Promise<IInstance[]> {
		const allInstance = await Instance.find();
		return allInstance;
	}

	// AJOUT D'UNE SALLE A UNE INSTANCE

	static async  addRoomToInstance(instanceName: string, roomId: Types.ObjectId) {
		try {
		  const instance = await InstanceService.findByName(instanceName);
		  console.log('Instance by name:', instance);
	  
		  if (instance) {
			instance.rooms.push(roomId);
	  
			const updatedInstance = await InstanceService.update({ rooms: instance.rooms }, instance._id);
			console.log('Updated instance:', updatedInstance);
		  } else {
			console.log('No instance found with the given name.');
		  }
		} catch (error) {
		  console.error('Error updating instance:', error);
		}
	  }
}


