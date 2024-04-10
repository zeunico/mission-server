import crypto from 'crypto';
import { secretKeyMission } from '../config';

export const TokenHandler = () => {
	const iv = crypto.randomBytes(16);
	const timestamp = (Date.now() / 1000) | 0;

	
	const cipher = crypto.createCipheriv('aes-256-ctr', secretKeyMission, iv);
	
	const encrypted = Buffer.concat([cipher.update(timestamp.toString()), cipher.final()]);

	const data = {
		iv: iv.toString('hex'),
		content: encrypted.toString('hex')
	};

	const convertToBase64 = Buffer.from(JSON.stringify(data));

	return convertToBase64.toString('base64');
};
