import { Types } from 'mongoose';

export interface IActivity {
	_id: Types.ObjectId,
	titre: string,
	description: string,
    etat: number,
	visible: boolean,
	active: boolean,
	guidee: boolean,
	createAt: Date,
	updateAt: Date
}
// Interface pour ActivityConsulter
export interface IActivityConsulter extends IActivity {
	description_detaillee_consulter: string,
	type: string
}

// Interface pour ActivityProduire
export interface IActivityProduire extends IActivity {
	description_detaillee_produire: string,
	types: string[]
}