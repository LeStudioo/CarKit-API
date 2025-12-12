import jwksClient from 'jwks-rsa';

export async function getAppleSignInKey(kid: string): Promise<string> {
    const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    const key = await client.getSigningKey(kid);
    return key.getPublicKey();
}