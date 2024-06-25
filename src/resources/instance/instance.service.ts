import  Instance  from '~/db/instance.model';
import { Types } from 'mongoose';
import { IInstance } from '~~/types/instance.interface';
import { NOMEM } from 'dns';

export class InstanceService {


	// Creation d une nouvelle instance par NOM

	static async createInstanceByName(instanceName) {
		try {
		const instanceData: IInstance = {
		  _id: new Types.ObjectId(),
		  name: instanceName,
		  rooms: []
		};
		const createdInstance = await InstanceService.create(instanceData);
		console.log('Created Instance :', createdInstance);
		} catch (error) {
		  console.error('Error creating room:', error);
		}
	  }


    // Creation d une nouvelle instance

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

	static async addRoomToInstance(instanceName: string, roomId: Types.ObjectId) {
		try {
		  // Find the instance by name
		  const instance = await InstanceService.findByName(instanceName);
		  console.log('Instance found by name:', instance);
	
		  if (instance) {
			// Add the room ID to the instance's rooms array if it's not already there
			if (!instance.rooms.includes(roomId)) {
			  instance.rooms.push(roomId);
			  console.log('Room ID ',roomId, ' ajouté à l array rooms de l instance', instanceName);
			  
			  // Update the instance with the new rooms array
			  const updatedInstance = await InstanceService.update({ rooms: instance.rooms }, instance._id);
			  console.log('Updated instance:', updatedInstance);
			  return updatedInstance;
			} else {
			  console.log('Room ID existe déjà dans l array rooms des instnecs:', roomId);
			}
		  } else {
			console.log('Pas d instance trouvee avec ce NOMEM.', instanceName);
		  }
		} catch (error) {
		  console.error('Error updating instance:', error);
		}
	  }
}
	


