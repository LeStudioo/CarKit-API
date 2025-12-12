import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AppError } from './error.middleware';

export const validationMiddleware = (type: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(type, req.body);
        const errors: ValidationError[] = await validate(dto);

        if (errors.length > 0) {
            const message = errors
                .map(error => Object.values(error.constraints || {}))
                .flat()
                .join(', ');
            return next(new AppError(400, message));
        }

        req.body = dto;
        next();
    };
};