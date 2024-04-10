import { Types } from 'mongoose';

export interface IUser {
	_id: Types.ObjectId,
    firstname: string,
	lastname: string,
    email: string,
    picture: Types.ObjectId | null,
	instructions: Types.ObjectId[],
	instance: string
}
