import { Router } from 'express';
import { InstructionService } from './instruction.service';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';
import { NotFoundException } from '~/utils/exceptions';

const InstructionController: Router = Router();

const instructionService = new InstructionService();
const usersService = new UsersService();

/**
 * @swagger
 * tags:
 *  name: Instructions
 *  description: Gestion des consignes
 * 
 * /instructions:
 *  post:
 *   summary: Création d'une consigne
 *   tags: [Instructions]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        userTarget:
 *         type: string
 *         description: ID de l'utilisateur cible
 *        room:
 *         type: string
 *         description: Code de la salle virtuelle
 *        consigne:
 *         type: string
 *         description: Consigne donné par le formateur à l'apprenant
 *   responses:
 *    201:
 *     description: Consigne créée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la consigne
 *         userTarget:
 *          type: string
 *          description: ID de l'utilisateur cible
 *         room:
 *          type: string
 *          description: Code de la salle virtuelle
 *         consigne:
 *          type: string
 *          description: Consigne donné par le formateur à l'apprenant
 *    500:
 *     description: Erreur serveur
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /instructions/{InstructionId}:
 *  get:
 *   summary: Récupération d'une consigne
 *   tags: [Instructions]
 *   parameters:
 *    - name: InstructionId
 *      in: path
 *      description: ID de la consigne
 *      required: true
 *   responses:
 *    200:
 *     description: Consigne récupérée
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          description: ID de la consigne
 *         userTarget:
 *          type: string
 *          description: ID de l'utilisateur cible
 *         room:
 *          type: string
 *          description: Code de la salle virtuelle
 *         consigne:
 *          type: string
 *          description: Consigne donné par le formateur à l'apprenant
 *    404:
 *     description: Consigne introuvable
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /instructions/{room}:
 *  get:
 *   summary: Récupération des consignes d'une salle virtuelle
 *   tags: [Instructions]
 *   parameters:
 *    - name: room
 *      in: path
 *      description: Code de la salle virtuelle
 *      required: true
 *   responses:
 *    200:
 *     description: Consignes récupérées
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de la consigne
 *          userTarget:
 *           type: string
 *           description: ID de l'utilisateur cible
 *          room:
 *           type: string
 *           description: Code de la salle virtuelle
 *          consigne:
 *           type: string
 *           description: Consigne donné par le formateur à l'apprenant
 *    404:
 *     description: Consignes introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 * 
 * /instructions/{room}/{userTarget}:
 *  get:
 *   summary: Récupération des consignes d'une salle virtuelle pour un utilisateur
 *   tags: [Instructions]
 *   parameters:
 *    - name: room
 *      in: path
 *      description: Code de la salle virtuelle
 *      required: true
 *    - name: userTarget
 *      in: path
 *      description: ID de l'utilisateur cible
 *      required: true
 *   responses:
 *    200:
 *     description: Consignes récupérées
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           description: ID de la consigne
 *          userTarget:
 *           type: string
 *           description: ID de l'utilisateur cible
 *          room:
 *           type: string
 *           description: Code de la salle virtuelle
 *          consigne:
 *           type: string
 *           description: Consigne donné par le formateur à l'apprenant
 *    404:
 *     description: Consignes introuvables
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          description: Message d'erreur
 */

InstructionController.route('/')
	.post(async (req, res, next) => {
		try {
			console.log('rq.body',req.body);

			const user = await usersService.find(req.body.userTarget);
			console.log('user instruction controller', user);

			if (!user) {
				throw new NotFoundException('Utilisateur introuvable');
			}

			const instruction = await instructionService.createInstruction(req.body.userTarget, req.body);
			user.instructions.push(instruction._id);
			usersService.update(user, user._id);
			
			console.log('instruction',instruction);
			console.log('user',user);
			return res.status(201).json(instruction);
		} catch (err) {
			next(err);
		}
	})
	.delete(async (req, res, next) => {
		try {
			await instructionService.clear();

			return res.status(200).json();
		}
		catch (err) {
			next(err);
		}
	});

InstructionController.route('/:InstructionId([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const instructionId = new Types.ObjectId(req.params.InstructionId);
			const instruction = await instructionService.find(instructionId);

			if (!instruction) {
				throw new NotFoundException('Instruction introuvable');
			}

			return res.status(200).json(instruction);
		} catch (err) {
			next(err);
		}
	});

InstructionController.route('/:room([a-z0-9]{6})')
	.get(async (req, res, next) => {
		try {
			const room = req.params.room;

			if (req.params.room !== req.params.room.toUpperCase()) {
				throw new NotFoundException('Room code invalide');
			}

			const instructions = await instructionService.findAll(room);

			return res.status(200).json(instructions);
		} catch (err) {
			next(err);
		}
	});

InstructionController.route('/:room([a-z0-9]{6})/:userTarget([a-z0-9]{24})')
	.get(async (req, res, next) => {
		try {
			const room = req.params.room;
			const userTarget = new Types.ObjectId(req.params.userTarget);

			if (room !== room.toUpperCase()) {
				throw new NotFoundException('Room code invalide');
			}

			const instructions = await instructionService.findByUserId(userTarget, room);

			return res.status(200).json(instructions);
		} catch (err) {
			next(err);
		}
	});



export default InstructionController;
