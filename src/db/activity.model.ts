import mongoose, { Schema } from 'mongoose';
import EEtat from '~~/types/etat.enum';
import { IActivity, IActivityConsulter, IActivityProduire } from '~~/types/activity.interface';
import { join } from 'path';
import { config } from '~/config';
import EMedia from '~~/types/media.enum';
const extendSchema = require('mongoose-extend-schema');


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
		type: mongoose.Schema.Types.Mixed, 
		enum: Object.values(EEtat),
		default: [],
		required: true,
	},
	
	'visible': {
		type: Boolean,
		default: false,
		required: true,
	},
	
	'active':  {
		type: Boolean,
		default: false,
		required: true,
		
	},

	'guidee': {
		type: Boolean,
		default: false,
		required: true,
		
	},
}, { timestamps: true });

const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);

// Extend the base schema for activity_consulter
const ActivityConsulterSchema = extendSchema(ActivitySchema,{

    'description_detaillee_consulter': {
        type: String,
        required: false
    },
	
	'type': {
		type: String,
		enum: Object.values(EMedia),
		required: false
	},
}, { timestamps: true });



// Extend the base schema for activity_produire
const ActivityProduireSchema = extendSchema(ActivitySchema,{
    'description_detaillee_produire': {
        type: String,
        required: true
    },
	'types':  [{
		type: String,
		enum: Object.values(EMedia),
		required: false
	}],
}, { timestamps: true });


// Create models for the new schemas

const ActivityConsulter = Activity.discriminator<IActivityConsulter>('ActivityConsulter', ActivityConsulterSchema);
const ActivityProduire = Activity.discriminator<IActivityProduire>('ActivityProduire', ActivityProduireSchema);

export default { ActivityConsulter, ActivityProduire, Activity };
