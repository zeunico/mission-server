import type { IThumb } from '~~/types/thumb.interface';
import MThumb from '~/db/thumb.model';
import { Types } from 'mongoose';


export class ThumbService {

	async create(userId: Types.ObjectId, thumbData: IThumb): Promise<IThumb> {
        const newThumb: IThumb = {
            ...thumbData,
            userId: userId
	    };
        console.log('new thumb', newThumb);
        return await MThumb.create(newThumb);
    }

    async update(thumbId: Types.ObjectId, thumbData: Partial<IThumb>): Promise<IThumb | null> {
        try {
            const updatedThumb = await MThumb.findByIdAndUpdate(thumbId, thumbData, { new: true });
            return updatedThumb;
        } catch (error) {
            console.error('Error updating thumb:', error);
            return null;
        }
    }

    async findAll(userId: Types.ObjectId): Promise<IThumb[]> {
		const thumbList = (await MThumb.find()).filter(thumb => thumb.userId.equals(userId));
		return thumbList;
	}

    // trouve un thumb en particulier pour un utilisateur donné
	async find(thumbId: Types.ObjectId): Promise<IThumb | null> {
		const researchedThumb = await MThumb.findById(thumbId);
		return researchedThumb;
	}

     // renvoyer le nom 
     async name(thumb: IThumb): Promise<string> {
        return thumb.name;
    }

    // renvoyer l ID 
    async _id(thumb: IThumb): Promise<Object> {
    return thumb._id;
    }


    async updateById(_id: Types.ObjectId, name: String): Promise<IThumb | null> {
        try {
            // Find the document by its ID
            const thumb = await MThumb.findById(_id);

            // If document found, update it
            if (thumb) {
                // Update the document
                name = name + '.png';
                // Update other fields as needed

                // Save the changes
                const updatedThumb = await thumb.save();

                return updatedThumb; // Return the updated document
            } else {
                throw new Error('Thumb not found');
            }
        } catch (error) {
            console.error('Error updating thumb by ID:', error);
            return null; // Return null in case of error
        }
    }


}
