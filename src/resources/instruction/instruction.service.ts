import { Types } from 'mongoose';
import MInstruction from '~/db/instruction.model';
import { IInstruction } from '~~/types/instruction.interface';

export class InstructionService {
	
	/**
	 * Crée une consigne à partir des informations données par l'utilisateur
	 */
	async createInstruction(userTarget: Types.ObjectId, datas: IInstruction): Promise<IInstruction> {
		const newInstruction: IInstruction = {
			...datas,
			userTarget: userTarget
		};

		return await MInstruction.create(newInstruction);
	}

	// Trouve l'entièreté des consignes uploadées
	async findAll(room: string): Promise<IInstruction[]> {
		const instructionList = await MInstruction.find({room}).exec();
		return instructionList;
	}

	// Trouve la liste des consignes pour un utilisateur donné
	async findByUserId(userTarget: Types.ObjectId, room: string): Promise<IInstruction[]> {
		const instructionList = await MInstruction.find({ userTarget, room }).exec();
		return instructionList;
	}

	// Trouve une consigne en particulier pour un utilisateur donné
	async find(instructionId: Types.ObjectId): Promise<IInstruction | null> {
		const researchedInstruction = await MInstruction.findById(instructionId);
		return researchedInstruction;
	}

	// supprime une consigne
	async delete(instructionId: Types.ObjectId): Promise<IInstruction | null> {
		const deletedInstruction = await MInstruction.findByIdAndDelete(instructionId);
		return deletedInstruction;
	}

	// vide la table de consignes
	async clear(): Promise<void> {
		await MInstruction.deleteMany({});
	}
}
