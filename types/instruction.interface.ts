import { Types } from 'mongoose';

export interface IInstruction {
	_id: Types.ObjectId,
	consigne: string,
	userTarget: Types.ObjectId,
	room: string,
	createdAt: Date,
	updatedAt: Date
}
