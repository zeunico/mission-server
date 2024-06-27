import  Instance  from '~/db/instance.model';
import { Types } from 'mongoose';
import { IInstance } from '~~/types/instance.interface';

export class InstanceService {

	// Creation d une nouvelle instance par NOM
	async createInstanceByName(instanceName) {
		try {
		const instanceData: IInstance = {
		  _id: new Types.ObjectId(),
		  name: instanceName,
		  rooms: []
		};
		const createdInstance = await this.create(instanceData);
		console.log('Nouvelle Instance Créée :', createdInstance);
		} catch (error) {
		  console.error('Erreur à la création de l instance', error);
		}
	  }

    // Création d une nouvelle instance
	async create(data: IInstance): Promise<IInstance> {
		const newInstance: IInstance = {
            ...data, 
		};

		console.log('instance .service : nouvelle instance à créer', newInstance);

		return await Instance.create(newInstance);
	}
	
	// Met à jour une instance en particulier
	async update(instanceData: Partial<IInstance>, _id: Types.ObjectId): Promise<IInstance | null> {
		const modifiedInstance = await Instance.findByIdAndUpdate(_id, instanceData, { new: true });
		console.log('insttanec service update');
		console.log(await Instance.findOne(_id));
		return modifiedInstance;
	}
	
	async findByName(instanceName: string): Promise<IInstance | null> {
		const researchedInstance = await Instance.findOne({ name: instanceName }).exec();
		return researchedInstance;
	}

	async findById(_id: Types.ObjectId): Promise<IInstance | null> {
		const researchedInstance = await Instance.findOne({ _id});
		return researchedInstance;
	}

	// Trouve tous les salles
	async findAll(): Promise<IInstance[]> {
		const allInstance = await Instance.find();
		return allInstance;
	}

	// AJOUT D'UNE SALLE A UNE INSTANCE
	async addRoomToInstance(instanceName: string, roomId: Types.ObjectId) {
		try {
		  // Find the instance by name
		  const instance = await this.findByName(instanceName);
		  console.log('Instance found by name:', instance);
	
		  if (instance) {
			// Add the room ID to the instance's rooms array if it's not already there
			if (!instance.rooms.includes(roomId)) {
			  instance.rooms.push(roomId);
			  console.log('Room ID ',roomId, ' ajouté à l array rooms de l instance', instanceName);
			  
			  // Update the instance with the new rooms array
			  const updatedInstance = await this.update({ rooms: instance.rooms }, instance._id);
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
	


