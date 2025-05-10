import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

/**
 * Route API pour la déconnexion d'un utilisateur
 * @param req La requête HTTP
 * @returns La réponse HTTP avec le statut de la déconnexion
 */
export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentification requise' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { message: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Note: Dans une implémentation plus complète, on pourrait ajouter le token à une liste noire
    // ou mettre à jour un champ 'lastLogout' dans la table utilisateur
    // Pour l'instant, nous allons simplement renvoyer un message de succès

    return NextResponse.json({
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    );
  }
}
