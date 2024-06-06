import { Types } from 'mongoose';

export interface IUser {
	_id: Types.ObjectId,
    firstname: string,
	lastname: string,
    email: string,
	moderator: boolean,
    picture: Types.ObjectId | null,
	instructions: Types.ObjectId[],
	instance: string,
	roomId: Types.ObjectId | null,
	createdAt: Date,
    updatedAt: Date,
}
