import  Instance  from '~/db/instance.model';
import { Types } from 'mongoose';
import { IInstance } from '~~/types/instance.interface';

export class InstanceService {
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

}


