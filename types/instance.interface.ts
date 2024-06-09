import { Types } from 'mongoose';

export interface IInstance {
	_id: Types.ObjectId,
	name: string,
	rooms: [Types.ObjectId],
	createAt: Date,
	updateAt: Date
}