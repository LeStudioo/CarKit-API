import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.util';
import { AppError } from './error.middleware';
import { UserService } from '../services/user.service';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(401, 'No token provided'));
    }

    const token = authHeader.substring(7);

    try {
        const { userId } = verifyJwt(token, 'token');

        const userService = new UserService();
        const user = await userService.findById(userId);

        if (!user || user.isDeleted) {
            return next(new AppError(401, 'User not found or deleted'));
        }

        req.userId = userId;
        next();
    } catch (error) {
        return next(new AppError(401, 'Invalid or expired token'));
    }
};