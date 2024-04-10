import { IApiException } from '~~/types/exceptions';

export class Exception extends Error implements IApiException {
	_error: string;
	_status: number;

	constructor(readonly error: string, readonly status: number) {
		super(error);
		this.error = error;
		this.status = status;
	}
}

// Exception 404
export class NotFoundException extends Exception {
	constructor(error: string) {
		super(error, 404);
	}
}

// Exception 400
export class BadRequestException extends Exception {
	constructor(error: string) {
		super(error, 400);
	}
}

// Exception 415
export class BadExtensionException extends Exception {
	constructor(error: string) {
		super(error, 415);
	}
}