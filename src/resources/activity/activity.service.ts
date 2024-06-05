import { Types } from 'mongoose';
import Activity  from '~/db/activity.model';
import ActivityConsulter   from '~/db/activity.model';
import  ActivityProduire from '~/db/activity.model';
import { IActivity } from '~~/types/activity.interface';
import { IActivityConsulter } from '~~/types/activity.interface';
import { IActivityProduire } from '~~/types/activity.interface';


export class ActivityService {
		

	static async create(data:IActivity): Promise<IActivity | undefined> {
		const newActivity: IActivity = {
			...data,
		};
		console.log('new act in create', newActivity);
		return  Activity.Activity.create(newActivity);
	}

	// Trouve tous les activités (produire et consulter confondues)
	static async findAll(): Promise<IActivity[]> {
		const consulterActivities = await ActivityConsulter.Activity.find();
		const produireActivities = await ActivityProduire.Activity.find();
		const allActivities = consulterActivities.concat(produireActivities);
		console.log('allAct in Act Service', allActivities);
		return allActivities;
	}

	// Trouve une activite par son ID
	static async find(_id: Types.ObjectId): Promise<IActivity | null> {
		const researchedActivity = await Activity.Activity.findById(_id);
		return researchedActivity;
	}
	
	static async findById(_id: Types.ObjectId): Promise<IActivity | null> {
		const researchedActivity = await Activity.Activity.findOne({ _id});
		return researchedActivity;
	}
}


export class ActivityConsulterService extends ActivityService {

	static async createConsulter(data:IActivityConsulter): Promise<IActivityConsulter | undefined> {
		console.log('data', data);
		if (!data.type && !data.description_detaillee_consulter){	
			super.create(data);
		}else {
			console.log('data.type', data.type);
			const newActivityConsulter: IActivityConsulter = {
				...data,
				type: data.type,
				description_detaillee_consulter: data.description_detaillee_consulter
			};
		console.log('new act in createCONSULTER via  ...', newActivityConsulter);
		return  ActivityConsulter.ActivityConsulter.create(newActivityConsulter);
		};
		
	}
		
	// Trouve tous les activités CONSULTER
	static async findAll(): Promise<IActivityConsulter[]> {
		const allActivitiesConsulter = await ActivityConsulter.ActivityConsulter.find();
		console.log('allAct', allActivitiesConsulter);
		return allActivitiesConsulter;
	}
	
}

export class ActivityProduireService extends ActivityService {

	static async createProduire(data:IActivityProduire): Promise<IActivityProduire | undefined> {
		console.log('data', data);
		if (!data.types){	
			super.create(data);
		}else {
			console.log('data.types', data.types);
			const newActivityProduire: IActivityProduire = {
				...data,
				types: data.types,
				description_detaillee_produire: data.description_detaillee_produire
			};
		console.log('new act in createProduire ds clas produire', newActivityProduire);
		return  ActivityProduire.ActivityProduire.create(newActivityProduire);
		};
	}
	
		
	// Trouve tous les activités (produire et consulter confondues)
	static async findAll(): Promise<IActivityProduire[]> {
		const allActivities = await ActivityProduire.ActivityProduire.find();
		console.log('allAct', allActivities);
		return allActivities;
	}
	
}