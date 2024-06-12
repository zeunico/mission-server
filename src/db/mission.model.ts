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
        type: String,
        enum: Object.values(EEtat), 
        required: true,
		default: "NON_DEMARREE"
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
		required: true,
		default: Object("6669e0ae822a94c1c7824a88")
	}
}, { timestamps: true });


const Mission = mongoose.model<IMission>('Mission', MissionSchema);

export default Mission;
