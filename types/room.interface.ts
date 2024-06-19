import { Types } from 'mongoose';

export interface IRoom {
	_id: Types.ObjectId,
	roomCode: string,
    moderatorId: Types.ObjectId,
	participants: Types.ObjectId[],
	mission: Types.ObjectId[],
	createdAt: Date,
	updatedAt: Date
}
