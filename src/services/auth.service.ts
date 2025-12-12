import jwt, { JwtPayload } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { getAppleSignInKey } from '../utils/apple-auth.util';
import { generateJwt } from '../utils/jwt.util';
import { UserService } from './user.service';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
    private userService: UserService;
    private googleClient: OAuth2Client;

    constructor() {
        this.userService = new UserService();
        this.googleClient = new OAuth2Client();
    }

    async authenticateWithApple(identityToken: string): Promise<{ user: any; token: string; refreshToken: string }> {
        const decoded = jwt.decode(identityToken, { complete: true });

        if (!decoded || !decoded.header.kid) {
            throw new AppError(401, 'Invalid Apple token');
        }

        const kid = decoded.header.kid;
        const appleKey = await getAppleSignInKey(kid);

        try {
            jwt.verify(identityToken, appleKey);
        } catch (error) {
            throw new AppError(401, 'Invalid Apple token signature');
        }

        const payload = decoded.payload as JwtPayload;
        const providerUserId = payload.sub!;
        const email = payload.email;

        let user = await this.userService.findByProviderUserId(providerUserId, 'apple');

        if (!user) {
            user = await this.userService.create(providerUserId, 'apple', email);
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                provider: user.provider,
                createdAt: user.createdAt
            },
            token: generateJwt('token', user.id),
            refreshToken: generateJwt('refreshToken', user.id)
        };
    }

    async authenticateWithGoogle(identityToken: string): Promise<{ user: any; token: string; refreshToken: string }> {
        let ticket;

        try {
            ticket = await this.googleClient.verifyIdToken({
                idToken: identityToken,
                audience: [process.env.GOOGLE_CLIENT_ID!]
            });
        } catch (error) {
            throw new AppError(401, 'Invalid Google token');
        }

        const payload = ticket.getPayload();

        if (!payload || !payload.sub) {
            throw new AppError(401, 'Invalid Google token payload');
        }

        const providerUserId = payload.sub;
        const email = payload.email;

        let user = await this.userService.findByProviderUserId(providerUserId, 'google');

        if (!user) {
            user = await this.userService.create(providerUserId, 'google', email);
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                provider: user.provider,
                createdAt: user.createdAt
            },
            token: generateJwt('token', user.id),
            refreshToken: generateJwt('refreshToken', user.id)
        };
    }
}