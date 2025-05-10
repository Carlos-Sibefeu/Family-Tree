import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/auth/password';

/**
 * Route API pour récupérer un utilisateur spécifique
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de l'utilisateur)
 * @returns La réponse HTTP avec les détails de l'utilisateur
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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

    // Vérifier que l'utilisateur est un administrateur ou qu'il consulte son propre profil
    const isAdmin = decodedToken.roles && decodedToken.roles.includes('ADMIN');
    const isOwnProfile = decodedToken.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        membershipApproved: true,
        createdAt: true,
        updatedAt: true,
        membershipRequest: isAdmin ? {
          select: {
            id: true,
            status: true,
            requestDate: true,
            processedDate: true,
            processedBy: {
              select: {
                id: true,
                username: true
              }
            }
          }
        } : undefined,
        createdPersons: {
          select: {
            id: true,
            firstName: true,
            lastName: true
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
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour mettre à jour un utilisateur
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de l'utilisateur)
 * @returns La réponse HTTP avec les détails de l'utilisateur mis à jour
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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

    // Vérifier que l'utilisateur est un administrateur ou qu'il modifie son propre profil
    const isAdmin = decodedToken.roles && decodedToken.roles.includes('ADMIN');
    const isOwnProfile = decodedToken.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les données de mise à jour
    const { username, email, password, roles, membershipApproved } = await req.json();

    // Préparer les données de mise à jour
    const updateData: Record<string, unknown> = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);
    
    // Seul un administrateur peut modifier les rôles et l'approbation d'adhésion
    if (isAdmin) {
      if (roles) updateData.roles = roles;
      if (membershipApproved !== undefined) updateData.membershipApproved = membershipApproved;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id },
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
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour supprimer un utilisateur
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de l'utilisateur)
 * @returns La réponse HTTP avec le statut de la suppression
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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

    // Vérifier que l'utilisateur est un administrateur
    const isAdmin = decodedToken.roles && decodedToken.roles.includes('ADMIN');
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Seuls les administrateurs peuvent supprimer des utilisateurs' },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur n'est pas le dernier administrateur
    // Vérifier si l'utilisateur est un administrateur
    const userWithRoles = await prisma.user.findUnique({
      where: { id },
      include: { roles: true }
    });
    
    const isUserAdmin = userWithRoles?.roles.some(role => role.name === 'ADMIN');
    
    if (isAdmin) {
      const adminCount = await prisma.user.count({
        where: {
          roles: {
            some: {
              name: 'ADMIN'
            }
          }
        }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: 'Impossible de supprimer le dernier administrateur' },
          { status: 400 }
        );
      }
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
