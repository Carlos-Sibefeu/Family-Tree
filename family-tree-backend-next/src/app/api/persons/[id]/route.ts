import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour récupérer une personne spécifique de l'arbre généalogique
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la personne)
 * @returns La réponse HTTP avec les détails de la personne
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

    // Récupérer la personne avec ses relations
    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        },
        relationshipsAsSource: {
          include: {
            target: true
          }
        },
        relationshipsAsTarget: {
          include: {
            source: true
          }
        }
      }
    });

    if (!person) {
      return NextResponse.json(
        { message: 'Personne non trouvée' },
        { status: 404 }
      );
    }

    // Extraire les parents et les enfants à partir des relations
    const parents = person.relationshipsAsSource
      .filter(rel => rel.type === 'PARENT_CHILD')
      .map(rel => rel.target);

    const children = person.relationshipsAsTarget
      .filter(rel => rel.type === 'PARENT_CHILD')
      .map(rel => rel.source);

    // Extraire les autres relations
    const otherRelations = [
      ...person.relationshipsAsSource.filter(rel => rel.type !== 'PARENT_CHILD'),
      ...person.relationshipsAsTarget.filter(rel => rel.type !== 'PARENT_CHILD')
    ];

    return NextResponse.json({
      ...person,
      parents,
      children,
      otherRelations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la personne:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération de la personne' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour mettre à jour une personne dans l'arbre généalogique
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la personne)
 * @returns La réponse HTTP avec les détails de la personne mise à jour
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
        { message: 'Vous n\'êtes pas autorisé à modifier des personnes' },
        { status: 403 }
      );
    }

    // Vérifier que la personne existe
    const existingPerson = await prisma.person.findUnique({
      where: { id }
    });

    if (!existingPerson) {
      return NextResponse.json(
        { message: 'Personne non trouvée' },
        { status: 404 }
      );
    }

    // Récupérer les données de mise à jour
    const {
      firstName,
      lastName,
      birthDate,
      deathDate,
      birthPlace,
      biography,
      parentIds,
      removeParentIds
    } = await req.json();

    // Mettre à jour la personne
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        deathDate: deathDate ? new Date(deathDate) : undefined,
        birthPlace,
        biography
      }
    });

    // Ajouter de nouvelles relations parent-enfant
    if (parentIds && parentIds.length > 0) {
      for (const parentId of parentIds) {
        // Vérifier si la relation existe déjà
        const existingRelation = await prisma.relationship.findFirst({
          where: {
            sourceId: id,
            targetId: parentId,
            type: 'PARENT_CHILD'
          }
        });

        if (!existingRelation) {
          // Créer la relation dans les deux sens
          await prisma.relationship.create({
            data: {
              sourceId: id,
              targetId: parentId,
              type: 'PARENT_CHILD'
            }
          });
          
          await prisma.relationship.create({
            data: {
              sourceId: parentId,
              targetId: id,
              type: 'PARENT_CHILD'
            }
          });
        }
      }
    }

    // Supprimer des relations parent-enfant
    if (removeParentIds && removeParentIds.length > 0) {
      for (const parentId of removeParentIds) {
        // Supprimer la relation dans les deux sens
        await prisma.relationship.deleteMany({
          where: {
            OR: [
              {
                sourceId: id,
                targetId: parentId,
                type: 'PARENT_CHILD'
              },
              {
                sourceId: parentId,
                targetId: id,
                type: 'PARENT_CHILD'
              }
            ]
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Personne mise à jour avec succès',
      person: updatedPerson
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la personne:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour de la personne' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour supprimer une personne de l'arbre généalogique
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la personne)
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
        { message: 'Seuls les administrateurs peuvent supprimer des personnes' },
        { status: 403 }
      );
    }

    // Vérifier que la personne existe
    const existingPerson = await prisma.person.findUnique({
      where: { id }
    });

    if (!existingPerson) {
      return NextResponse.json(
        { message: 'Personne non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer toutes les relations associées à cette personne
    await prisma.relationship.deleteMany({
      where: {
        OR: [
          { sourceId: id },
          { targetId: id }
        ]
      }
    });

    // Supprimer la personne
    await prisma.person.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Personne supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la personne:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la suppression de la personne' },
      { status: 500 }
    );
  }
}
