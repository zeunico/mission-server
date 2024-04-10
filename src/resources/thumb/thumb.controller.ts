import multer from 'multer';
import { Router } from 'express';
import { Types } from 'mongoose';
import { ThumbService } from './thumb.service';
import { UsersService } from '~/resources/users/users.service';
import { NotFoundException } from '~/utils/exceptions';
import { extname, join } from 'path';
import { getFileNameFormatted, getFileTypeByExtension } from '~/utils/file.utils';
import { config } from '~/config';
import fs from 'fs';


// Création d'un Router Express
const ThumbController: Router = Router();

// Instanciation des services
const thumbService = new ThumbService();
const userService = new UsersService();

// Création d'un objet multer Storage
const fileStorage = multer.diskStorage({
	// définit le dossier de destination à partir de l'ID de l'utilisateur
	destination: function(req, file, cb) {
		

		try {
			
			const dest = join(config.ATTACHEMENT_SRC, req.body.userId, 'thumbs');
			if (!fs.existsSync(dest)) {
				fs.mkdirSync(dest, { recursive: true });
			}
			cb(null, join(dest));
		} catch (err) {
			cb((err as Error), '');
		}
	
	},

	filename: function (req, file, cb) {
		const extension = "zaza";
		try {
			const fileName = getFileNameFormatted(file.originalname, extension);
			req.body.name = fileName;
			cb(null, fileName);
	
		} catch (err) {
			cb((err as Error), '');
		}
	}
});

// Création d'un objet multer
const fileUpload = multer({
	storage: fileStorage
});

ThumbController.route('/')
		.post(fileUpload.single('file'), async (req, res, next) => {
		try {
			console.log('ADC');
			const userId = new Types.ObjectId(req.body.userId);
			const user = await userService.find(userId);
			if (!user) {
				throw new NotFoundException('Mauvais ID utilisateur');
			}
						const createdThumb = await thumbService.create(userId, req.body);
			return res.status(201).json(createdThumb);
			
		} catch (err) {
			next(err);
		}
	});

ThumbController.route('/user/:userId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const userId = new Types.ObjectId(req.params.userId);
			const user = await userService.find(userId);
			if (!user) {
				throw new NotFoundException('Mauvais ID utilisateur');
			}
	
			const thumbList = await thumbService.findAll(userId);
			return res.status(200).json(thumbList);
		} catch (err) {
			next(err);
		}
	});

ThumbController.route('/:thumbId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const thumbId = new Types.ObjectId(req.params.thumbId);
			const thumb = await thumbService.find(thumbId);

			if (!thumb) {
				throw new NotFoundException('Thumb introuvable');
			}
			res.sendFile(join(config.ATTACHEMENT_SRC, thumb.userId.toString(), 'thumbs', thumb.name));
		} catch(err) {
			next(err);
		}
	});
	
export default ThumbController;