import jwt from 'jsonwebtoken';

export const generateJwt = (type: 'token' | 'refreshToken', userId: string): string => {
    const secret = type === 'token' ? process.env.JWT_SECRET! : process.env.JWT_REFRESH_SECRET!;
    const expiresIn = type === 'token' ? '1h' : '7d';

    return jwt.sign({ userId, type }, secret, { expiresIn });
};

export const verifyJwt = (token: string, type: 'token' | 'refreshToken'): { userId: string; type: string } => {
    const secret = type === 'token' ? process.env.JWT_SECRET! : process.env.JWT_REFRESH_SECRET!;
    return jwt.verify(token, secret) as { userId: string; type: string };
};