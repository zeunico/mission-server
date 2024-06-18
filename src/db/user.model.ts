import mongoose, { Schema, SchemaType } from 'mongoose';
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

	'connexion': {
		type: Schema.Types.ObjectId,
		ref:'Room',
		default: null 
	},
	
	'roomId':  [{
		type: Schema.Types.ObjectId,
		ref: 'Room',
		required: true
	}],

	'instance': {
		type: String,
		required: true
	}

}, { timestamps: true });


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
