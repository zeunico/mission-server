import { Types } from 'mongoose';

export interface IActivity {
	_id: Types.ObjectId,
	titre: string,
	description: string,
    etat: string,
    visible: boolean,
	active: boolean,
	guidee: boolean,
	createAt: Date,
	updateAt: Date
}