import mongoose, { Schema } from 'mongoose';
import { IUserData } from '~~/types/userData.interface';

const UserDataSchema = new mongoose.Schema<IUserData>({
	'mediaId': {
		type: Schema.Types.ObjectId,
		ref: 'Media',
		required: false
	},

	'thumbId': {
		type: Schema.Types.ObjectId,
		ref: 'Thumb',
		required: false
	},

	'description': {
		type: String,
		required: true
	},

	'room': {
		type: String,
		required: true
	},

	'userId': {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	'instance': {
		type: String,
		required: true
	}
}, { timestamps: true });

const MUserData = mongoose.model<IUserData>('UserData', UserDataSchema);

export default MUserData;
