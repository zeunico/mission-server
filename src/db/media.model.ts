import mongoose, { Schema } from 'mongoose';
import { IMedia } from '~~/types/media.interface';
import EMedia from '~~/types/media.enum';
import { join } from 'path';
import { config } from '~/config';

const MediaSchema = new mongoose.Schema<IMedia>({
	'type': {
		type: String,
		enum: Object.values(EMedia),
		required: true
	},
	'name': {
		type: String,
		required: true,
		unique: true
	},
	'userId': {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

MediaSchema.method('path', function(this: IMedia) {
	return join(config.ATTACHEMENT_SRC, this.userId.toString(), this.type + 's', this.name);
});
const MMedia = mongoose.model<IMedia>('Media', MediaSchema);

export default MMedia;