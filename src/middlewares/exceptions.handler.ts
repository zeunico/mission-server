import { NextFunction, Request, Response } from 'express';
import { Exception } from '~/utils/exceptions';

// Middleware de gestion globale des erreurs
export const ExceptionsHandler = (err: Exception, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		return next(err);
	}

	if (err.status && err.error) {
		return res.status(err.status).json({ error: err.error });
	}

	return res.status(500).json({error: err});
};