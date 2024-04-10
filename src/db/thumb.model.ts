import mongoose, { Schema } from 'mongoose';
import { IThumb } from '~~/types/thumb.interface';
import { join } from 'path';
import { config } from '~/config';
import EMedia from '~~/types/media.enum';


const ThumbSchema = new mongoose.Schema<IThumb>({
		'type': {
		type: String,
		enum: Object.values(EMedia),
		required: true
	},
	'userId': {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	'name': {
		type: String,
		required: true,
		unique: true
	}
}, { timestamps: true });

ThumbSchema.method('path', function(this: IThumb) {
	return join(config.ATTACHEMENT_SRC, this.userId.toString(), 'thumbs');
});


const MThumb = mongoose.model<IThumb>('Thumb', ThumbSchema);

export default MThumb;
