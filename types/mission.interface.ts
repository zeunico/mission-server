import { Types } from 'mongoose';

export interface IMission {
	_id: Types.ObjectId,
	roomId: Types.ObjectId,
    titre: string,
	activites: Types.ObjectId[];
	nb_activites: number,
    etat: string,
    visible: boolean,
	active: boolean,
	guidee: boolean,
	visuel: string | null
	createAt: Date,
	updateAt: Date
}