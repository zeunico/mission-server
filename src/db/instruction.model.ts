import mongoose, { Schema } from 'mongoose';
import { IInstruction } from '~~/types/instruction.interface';

const InstructionSchema = new mongoose.Schema<IInstruction>({
	'consigne': {
		type: String,
		required: true
	},

	'room': {
		type: String,
		required: true
	},

	'userTarget': {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true	
	}
	
}, { timestamps: true });

const MInstruction = mongoose.model<IInstruction>('Instruction', InstructionSchema);

export default MInstruction;
