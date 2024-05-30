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
		required: true	
	}
	
}, { timestamps: true });

const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;