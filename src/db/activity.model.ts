import mongoose, { Schema, SchemaType } from 'mongoose';
import EEtat from '~~/types/etat.enum';
import { IActivity, IActivityConsulter, IActivityProduire } from '~~/types/activity.interface';
import { join } from 'path';
import { config } from '~/config';
import EMedia from '~~/types/media.enum';
import { freemem } from 'os';
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


// Extend the base schema for activity_consulter
const ActivityConsulterSchema = extendSchema(ActivitySchema,{

    'description_detaillee_consulter': {
        type: String,
        required: true
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




// Pre-save hook de validation des keys états
ActivitySchema.pre('save', function (next) {
	// Liste des états dau type EEtat
	const etatKeys = Object.values(EEtat) as string[];
	const enumKeys = Array.from(this.etat.keys());
	for (const key of etatKeys) {
		if (!enumKeys.includes(key)) {
		  const error = new Error(`Invalid key in etat`);
		  return next(error);
		}
	  }
  next();
  });

// Create models for the new schemas
const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
const ActivityConsulter = Activity.discriminator<IActivityConsulter>('ActivityConsulter', ActivityConsulterSchema);
const ActivityProduire = Activity.discriminator<IActivityProduire>('ActivityProduire', ActivityProduireSchema);

export default { ActivityConsulter, ActivityProduire, Activity };
