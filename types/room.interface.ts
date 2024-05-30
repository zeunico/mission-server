import { Types } from 'mongoose';

export interface IRoom {
	_id: Types.ObjectId,
	roomCode: string,
    moderatorId: Types.ObjectId,
	createAt: Date,
	updateAt: Date
}
