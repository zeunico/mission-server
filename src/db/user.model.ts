import mongoose, { Schema } from 'mongoose';
import {IUser} from '~~/types/users.interface';

const UserSchema = new mongoose.Schema<IUser>({
	'email': {
		type: String,
		unique: false,
		required: true
	},
 
	'firstname': {
		type: String,
		unique: false,
		required: true
	},

	'lastname': {
		type: String,
		unique: false,
		required: true
	},
	
	'picture': {
		type: Schema.Types.ObjectId,
		ref: 'Media'
	},
	
	'instructions': [{
		type: Schema.Types.ObjectId,
		ref: 'Instruction'
	}],

	'instance': {
		type: String,
		required: true
	}
}, { timestamps: true });


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
