import mongoose, { Schema, SchemaType } from 'mongoose';
import {IMission} from '~~/types/mission.interface';
import EEtat from '~~/types/etat.enum';

const MissionSchema = new mongoose.Schema<IMission>({
	'titre': {
		type: String,
		unique: false,
		required: true
	},
	
	'roomId': {
		type: Schema.Types.ObjectId,		
		unique: false,
		required: true,
		ref: 'room'
	},

	'activites': [{
		type: Schema.Types.ObjectId,
		ref: 'mission'

	}],
	 
	'nb_activites': {
		type: Number,
		unique: false,
		required: false
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
	
	'visuel': {
		type: String,
	
	}
}, { timestamps: true });


const Mission = mongoose.model<IMission>('Mission', MissionSchema);

export default Mission;
