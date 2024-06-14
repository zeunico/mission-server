import mongoose, { Schema } from 'mongoose';
import { IRoom } from '~~/types/room.interface';

const RoomSchema = new mongoose.Schema<IRoom>({
	'roomCode': {
		type: String,
		required: true
	},

	'moderatorId': {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	'participants': [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],

	'mission': [{
		type: Schema.Types.ObjectId,
		ref: 'Mission'
	}],
	
}, { timestamps: true });

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;