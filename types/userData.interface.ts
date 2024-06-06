import { Types } from 'mongoose';

export interface IUserData {
	_id: Types.ObjectId,
    activityId: Types.ObjectId,
    mediaId?: Types.ObjectId,
    thumbId?: Types.ObjectId,
    description: string,
	room: string,
    userId: Types.ObjectId,
	instance: string,
    createdAt: Date,
    updatedAt: Date,
}
