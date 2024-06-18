import { Types } from 'mongoose';

export interface IUser {
	_id: Types.ObjectId,
    firstname: string,
	lastname: string,
    email: string,
    picture: Types.ObjectId | null,
	roomId: Types.ObjectId[] | null,
	instructions: Types.ObjectId[],
	connexion: Types.ObjectId,
	instance: string,
	createdAt: Date,
    updatedAt: Date,
}
