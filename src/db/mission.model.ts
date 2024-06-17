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
		ref: 'mission',
		required: true,
		default: []
	}],
	 
	'nb_activites': {
		type: Number,
		unique: false,
		required: true,
		default: 0
	},
	
	'etat': {
		type: Map,
		of: [Schema.Types.ObjectId],	
		required: true,
		default:  {
			"EN_COURS": [],
			"NON_DEMARREE": [],
			"TERMINEE": []
			},
	  },

	
	'visible': {
		type: Boolean,
		required: true,
		default: false
		
	},
	
	'active':  {
		type: Boolean,
		required: true,
		default: false
		
	},

	'guidee': {
		type: Boolean,
		required: true,
		default: false	
	},
	
	'visuel': {
		type: Schema.Types.ObjectId,
		ref: 'Media',
		required: false,
		default: null
	}
}, { timestamps: true });


const Mission = mongoose.model<IMission>('Mission', MissionSchema);

export default Mission;
