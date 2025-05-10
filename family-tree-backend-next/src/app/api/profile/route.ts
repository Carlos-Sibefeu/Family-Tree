import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { hashPassword, comparePassword } from '@/lib/auth/password';

/**
 * Route API pour récupérer le profil de l'utilisateur connecté
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les détails du profil
 */
export async function GET(req: NextRequest) {
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

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        membershipApproved: true,
        createdAt: true,
        updatedAt: true,
        persons: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            deathDate: true
          }
        },
        membershipRequests: {
          where: {
            status: 'PENDING'
          },
          select: {
            id: true,
            status: true,
            requestDate: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour mettre à jour le profil de l'utilisateur connecté
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les détails du profil mis à jour
 */
export async function PATCH(req: NextRequest) {
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

    // Récupérer les données de mise à jour
    const { username, email, currentPassword, newPassword } = await req.json();

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: decodedToken.id }
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    // Si l'utilisateur souhaite changer son mot de passe
    if (newPassword) {
      // Vérifier que le mot de passe actuel est correct
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Le mot de passe actuel est requis pour changer de mot de passe' },
          { status: 400 }
        );
      }
      
      const isPasswordValid = await comparePassword(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Le mot de passe actuel est incorrect' },
          { status: 400 }
        );
      }
      
      // Hacher le nouveau mot de passe
      updateData.password = await hashPassword(newPassword);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: decodedToken.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        membershipApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}
