import mongoose, { Schema, Types } from 'mongoose';
import { IInstance } from '~~/types/instance.interface';

const Instancechema = new mongoose.Schema<IInstance>({
	'name': {
		type: String,
		required: true
	},

	'rooms': [{
		type: Types.ObjectId,
	
	}],
	
}, { timestamps: true });

const MInstance = mongoose.model<IInstance>('Instance', Instancechema);

export default MInstance;