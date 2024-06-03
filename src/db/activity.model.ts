import mongoose, { Schema } from 'mongoose';
import { IActivity } from '~~/types/activity.interface';
import EMedia from '~~/types/media.enum';


const ActivitySchema = new mongoose.Schema<IActivity>({
	'titre': {
		type: String,
		required: true
	},

    'description': {
		type: String,
		required: true
	},

	'etat': {
		type: String,
		enum: Object.values(EEtat),
		required: true
	},
	
	'visible': {
		type: Boolean,
		
	},
	
	'active':  {
		type: Boolean,
		
	},

	'guidee': {
		type: Boolean,
		
	},
}, { timestamps: true });

const MActivity = mongoose.model<IActivity>('Instruction', ActivitySchema);

export default MActivity;
