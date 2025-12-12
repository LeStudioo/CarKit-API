import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    appleAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identityToken } = req.body;
            const result = await this.authService.authenticateWithApple(identityToken);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    googleAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identityToken } = req.body;
            const result = await this.authService.authenticateWithGoogle(identityToken);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}