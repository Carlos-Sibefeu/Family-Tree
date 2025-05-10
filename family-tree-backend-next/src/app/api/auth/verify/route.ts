import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour vérifier la validité d'un token JWT
 * @param req La requête HTTP
 * @returns La réponse HTTP avec le statut de la vérification
 */
export async function POST(req: NextRequest) {
  try {
    // Récupérer le token depuis le corps de la requête
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token manquant' },
        { status: 400 }
      );
    }

    // Vérifier le token
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { valid: false, message: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        roles: decodedToken.roles
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return NextResponse.json(
      { valid: false, message: 'Une erreur est survenue lors de la vérification du token' },
      { status: 500 }
    );
  }
}
