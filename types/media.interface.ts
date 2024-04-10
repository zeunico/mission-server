import EMedia from './media.enum';
import { Types } from 'mongoose';

export interface IMedia {
	_id: Types.ObjectId,
    type: EMedia,
    name: string,
    userId: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    path(): string
}
