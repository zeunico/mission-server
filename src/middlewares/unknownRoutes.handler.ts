import { NotFoundException } from '~/utils/exceptions';

/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
export const UnknownRoutesHandler = () => {
	throw new NotFoundException('La ressource demandée n\'existe pas');
};
