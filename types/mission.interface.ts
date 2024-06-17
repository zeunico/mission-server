import { Types } from 'mongoose';
import EEtat from './etat.enum';


export interface IMission {
	_id: Types.ObjectId,
	roomId: Types.ObjectId,
    titre: string,
	activites: Types.ObjectId[];
	nb_activites: number,
	etat: Partial<Record<EEtat, Types.ObjectId[]>>,
    visible: boolean,
	active: boolean,
	guidee: boolean,
	visuel?: Types.ObjectId,
	createAt: Date,
	updateAt: Date
}