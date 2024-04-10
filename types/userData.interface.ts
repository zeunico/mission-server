import { Types } from 'mongoose';

export interface IUserData {
	_id: Types.ObjectId,
    mediaId?: Types.ObjectId,
    thumbId?: Types.ObjectId,
    description: string,
	room: string,
    createdAt: Date,
    updatedAt: Date,
    userId: Types.ObjectId,
	instance: string
}
