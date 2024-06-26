import EMedia from '~~/types/media.enum';
import { BadExtensionException, BadRequestException } from './exceptions';
import { config } from '~/config';
import { join } from 'path';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { readFile, unlink } from 'fs/promises';

export const getFileTypeByExtension = (extension: string): EMedia => {
	switch (extension) {
	case '.jpg':
	case '.JPG':
	case '.png':
	case '.PNG':
	case '.jpeg':
	case '.JPEG':
	case '.svg':
	case '.SVG':
		return EMedia.IMAGE;
	case '.mp4':
	case '.MP4':
		return EMedia.VIDEO;
	case '.mp3':
	case '.flac':
	case '.MP3':
	case '.FLAC':
		return EMedia.AUDIO;
	case '.pdf':
	case '.PDF':
		return EMedia.SLIDE;
	case '.doc':
	case '.docx':
	case '.txt':
	case '.DOC':
	case '.DOCX':
	case '.TXT':
		return EMedia.TEXT;
	default:
		throw new BadRequestException('Le type de fichier n\'est pas reconnu');
	}
};

export const getPathByExtension = (extension: string, id: string): string => {
	switch(extension) {
	case '.jpg':
	case '.JPG':
	case '.png':
	case '.PNG':
	case '.jpeg':
	case '.JPEG':
	case '.svg':
	case '.SVG':
		return join(config.ATTACHEMENT_SRC, id, 'images');
	case '.mp4':
	case '.MP4':
		return join(config.ATTACHEMENT_SRC, id, 'videos');
	case '.mp3':
	case '.flac':
	case '.MP3':
	case '.FLAC':
		return join(config.ATTACHEMENT_SRC, id, 'audios');
	case '.pdf':
	case '.PDF':
		return join(config.ATTACHEMENT_SRC, id, 'slides');
	case '.doc':
	case '.docx':
	case '.txt':
	case '.DOC':
	case '.DOCX':
	case '.TXT':
		return join(config.ATTACHEMENT_SRC, id, 'textes');
	default:
		throw new BadExtensionException('Mauvaise format de fichier');
	}
};

export const getFileNameFormatted = (filename: string, extension: string): string => {
	return filename.substring(0, filename.length - extension.length) + '_' + Date.now() + extension;
};

export const downloadFile = async (url: string): Promise<[Buffer, string]> => {
	const filename = url.split('/').pop() as string;
	const tmpUri = join(tmpdir(), filename);

	const writer = createWriteStream(tmpUri);

	try {
		const res = await axios.get(url, { responseType: 'stream' });
	
		await new Promise((resolve, reject) => {
			let error: Error | null = null;
	
			res.data.pipe(writer);
	
			writer.on('error', (err) => {
				error = err;
				writer.close();
				reject(err);
			});
	
			writer.on('close', () => {
				if(!error) resolve(true);
			});
		});
	
		const buffer = await readFile(tmpUri);
		unlink(tmpUri);
	
		return [buffer, filename];
	} catch (err) {
		console.error(err);
		throw err;
	}
};
