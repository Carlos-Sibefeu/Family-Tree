import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour récupérer une relation spécifique
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la relation)
 * @returns La réponse HTTP avec les détails de la relation
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

    // Récupérer la relation
    const relationship = await prisma.relationship.findUnique({
      where: { id },
      include: {
        source: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            deathDate: true
          }
        },
        target: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            deathDate: true
          }
        }
      }
    });

    if (!relationship) {
      return NextResponse.json(
        { message: 'Relation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(relationship);
  } catch (error) {
    console.error('Erreur lors de la récupération de la relation:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération de la relation' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour mettre à jour une relation
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la relation)
 * @returns La réponse HTTP avec les détails de la relation mise à jour
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

    // Vérifier que l'utilisateur est approuvé
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id }
    });

    if (!user || !user.membershipApproved) {
      return NextResponse.json(
        { message: 'Vous n\'êtes pas autorisé à modifier des relations' },
        { status: 403 }
      );
    }

    // Vérifier que la relation existe
    const existingRelationship = await prisma.relationship.findUnique({
      where: { id }
    });

    if (!existingRelationship) {
      return NextResponse.json(
        { message: 'Relation non trouvée' },
        { status: 404 }
      );
    }

    // Récupérer les données de mise à jour
    const { type, weight, description } = await req.json();

    // Mettre à jour la relation
    const updatedRelationship = await prisma.relationship.update({
      where: { id },
      data: {
        type,
        weight,
        description
      }
    });

    // Si c'est une relation parent-enfant, mettre à jour également la relation inverse
    if (type === 'PARENT_CHILD' && existingRelationship.type === 'PARENT_CHILD') {
      // Trouver la relation inverse
      const inverseRelationship = await prisma.relationship.findFirst({
        where: {
          sourceId: existingRelationship.targetId,
          targetId: existingRelationship.sourceId,
          type: 'PARENT_CHILD'
        }
      });

      if (inverseRelationship) {
        await prisma.relationship.update({
          where: { id: inverseRelationship.id },
          data: {
            weight,
            description
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Relation mise à jour avec succès',
      relationship: updatedRelationship
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la relation:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour de la relation' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour supprimer une relation
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la relation)
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
        { message: 'Seuls les administrateurs peuvent supprimer des relations' },
        { status: 403 }
      );
    }

    // Vérifier que la relation existe
    const existingRelationship = await prisma.relationship.findUnique({
      where: { id }
    });

    if (!existingRelationship) {
      return NextResponse.json(
        { message: 'Relation non trouvée' },
        { status: 404 }
      );
    }

    // Si c'est une relation parent-enfant, supprimer également la relation inverse
    if (existingRelationship.type === 'PARENT_CHILD') {
      await prisma.relationship.deleteMany({
        where: {
          sourceId: existingRelationship.targetId,
          targetId: existingRelationship.sourceId,
          type: 'PARENT_CHILD'
        }
      });
    }

    // Supprimer la relation
    await prisma.relationship.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Relation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la relation:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la suppression de la relation' },
      { status: 500 }
    );
  }
}
