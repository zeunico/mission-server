import type { IMedia } from '~~/types/media.interface';
import MMedia from '~/db/media.model';
import { Types } from 'mongoose';


export class MediaService {

	// Trouve tout les médias d'un utilisateur
	async findAll(userId: Types.ObjectId): Promise<IMedia[]> {
		const mediaList = (await MMedia.find()).filter(media => media.userId.equals(userId));
		return mediaList;
	}

	// trouve un media en particulier pour un utilisateur donné
	async find(mediaId: Types.ObjectId): Promise<IMedia | null> {
		const researchedMedia = await MMedia.findById(mediaId);
		return researchedMedia;
	}

	// Trouve la liste des médias pour un utilisateur donné
	async findByUserId(userId: Types.ObjectId): Promise<IMedia[]> {
		const mediaList = (await MMedia.find({ userId }).exec());
		return mediaList;
	}

	
	// Créé un média
	async create(userId: Types.ObjectId, mediaData: IMedia): Promise<IMedia> {
		const newMedia: IMedia = {
			...mediaData,
			userId: userId
		};
		console.log('Nouveau document Media', newMedia);

		return await MMedia.create(newMedia);
	}


	// Supprime un media
	async delete(_id: Types.ObjectId): Promise<IMedia | null> {
		const deletedMedia = await MMedia.findByIdAndDelete(_id);
		console.log('Media supprimée !');
		return deletedMedia;
	}


}
