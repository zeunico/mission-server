import type { IUser } from '~~/types/users.interface';
import User from '~/db/user.model';
import { Types } from 'mongoose';
import { config } from '~/config';
import { join } from 'path';
import { IMedia } from '~~/types/media.interface';
import { NotFoundException } from '~/utils/exceptions';

export class UsersService {

	// Trouve tous les utilisateurs
	async findAll(): Promise<IUser[]> {
		const userList = await User.find();
		return userList;
	}

	// trouve un utilisateur en particulier
	async find(_id: Types.ObjectId): Promise<IUser | null> {
		const researchedUser = await User.findById(_id);
		return researchedUser;
	}

	// trouve un utilisateur via l'email
	async findByEmail(email: string, instance?: string, room?: string): Promise<IUser | null> {
		const researchedUser = await User.findOne({ email, instance, room});
		return researchedUser;
	}

	async findByInstance(instance: string): Promise<IUser[]> {
		const userList = await User.find({ instance });
		return userList;
	}

	// Crée un utilisateur
	async create(data: IUser): Promise<IUser> {
		const newUser: IUser = {
			...data
		};
		return await User.create(newUser);
	}

	// Met à jour un utilisateur en particulier
	async update(userData: Partial<IUser>, _id: Types.ObjectId): Promise<IUser | null> {
		const modifiedUser = await User.findByIdAndUpdate(_id, userData, { new: true });
		console.log('yep c ici');
		console.log(await User.findOne(_id));
		return modifiedUser;
	}

	// Suppression d'un utilisateur
	async delete(_id: Types.ObjectId): Promise<void> {
		await User.findByIdAndDelete(_id);
	}

	async findUserImage(_id: Types.ObjectId): Promise<string> {
		const user = await User.findById(_id, {picture: 1}).populate<{picture: IMedia}>('picture').exec();

		if (!user) {
			throw new NotFoundException('Utilisateur introuvable');
		}

		if (!user.picture || user.picture === null) {
			return join(config.ATTACHEMENT_SRC, 'default.jpg'); 
		} 
		return user.picture.path();
		
	}
}
