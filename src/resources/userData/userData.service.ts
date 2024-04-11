import type { IUserData } from '~~/types/userData.interface';
import MUserData from '~/db/userData.model';
import { Types } from 'mongoose';
import { IMedia } from '~~/types/media.interface';
import { IUser } from '~~/types/users.interface';

export class UserDataService {

	/**
	 * Crée une réponse à partir des informations données par l'utilisateur
	 * @param userId 
	 * @param datas 
	 * @returns 
	 */
	async createUserData(user: IUser, mediaId: Types.ObjectId | undefined, thumbId: Types.ObjectId | undefined, datas: IUserData): Promise<IUserData> {
		const newUserData: IUserData = {
			...datas,
			mediaId: mediaId? mediaId: undefined,
			thumbId: thumbId? thumbId: undefined,
			userId: user._id,
			instance: user.instance
		};
		console.log('new userdata', newUserData);

		return await MUserData.create(newUserData);
	}

	// Trouve l'entièreté des réponses uploadées
	async findAll(room?: string, instance?: string): Promise<(Omit<IUserData, 'mediaId'> & { mediaId: Pick<IMedia, '_id' | 'type'> })[]> {
		const userDataList = await MUserData.find({ room, instance }).populate<{ mediaId: Pick<IMedia, '_id' | 'type'> }>('mediaId', 'type _id').exec();
		return userDataList;
	}

	// Trouve la liste des réponses pour un utilisateur donné
	async findByUserId(user: IUser, room?: string): Promise<(Omit<IUserData, 'mediaId'> & { mediaId: Pick<IMedia, 'type'> })[]> {
		if (!room) {
			return await MUserData.find({ userId: user._id}).populate<{ mediaId: Pick<IMedia, 'type'> }>('mediaId', 'type').exec();
		}
		const userDataList = await MUserData.find({ userId: user._id, instance: user.instance, room }).populate<{ mediaId: Pick<IMedia, 'type'> }>('mediaId', 'type').exec();
		return userDataList;
	}

	// Trouve une réponse en particulier pour un utilisateur donné
	async find(userDataId: Types.ObjectId): Promise<IUserData | null> {
		const researchedData = await MUserData.findById(userDataId);
		return researchedData;
	}

	// supprime une réponse
	async delete(userDataId: Types.ObjectId): Promise<IUserData | null> {
		const deletedData = await MUserData.findByIdAndDelete(userDataId);
		return deletedData;
	}

	// vide la table de réponses
	async clear(): Promise<void> {
		await MUserData.deleteMany({});
	}

}
