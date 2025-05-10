import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour récupérer toutes les relations de l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec la liste des relations
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

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url);
    const personId = searchParams.get('personId');
    const type = searchParams.get('type');
    
    // Construire la requête de recherche
    let whereClause = {};
    if (personId) {
      whereClause = {
        OR: [
          { sourceId: parseInt(personId) },
          { targetId: parseInt(personId) }
        ]
      };
    }
    
    if (type) {
      whereClause = {
        ...whereClause,
        type
      };
    }

    // Récupérer toutes les relations
    const relationships = await prisma.relationship.findMany({
      where: whereClause,
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

    return NextResponse.json(relationships);
  } catch (error) {
    console.error('Erreur lors de la récupération des relations:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des relations' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour créer une nouvelle relation dans l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les détails de la relation créée
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

    // Vérifier que l'utilisateur est approuvé
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id }
    });

    if (!user || !user.membershipApproved) {
      return NextResponse.json(
        { message: 'Vous n\'êtes pas autorisé à ajouter des relations' },
        { status: 403 }
      );
    }

    // Récupérer les données de la relation
    const { sourceId, targetId, type, weight, description } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!sourceId || !targetId || !type) {
      return NextResponse.json(
        { message: 'Les IDs source et cible ainsi que le type sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que les personnes existent
    const sourcePerson = await prisma.person.findUnique({
      where: { id: sourceId }
    });

    const targetPerson = await prisma.person.findUnique({
      where: { id: targetId }
    });

    if (!sourcePerson || !targetPerson) {
      return NextResponse.json(
        { message: 'Une ou plusieurs personnes n\'existent pas' },
        { status: 404 }
      );
    }

    // Vérifier si la relation existe déjà
    const existingRelationship = await prisma.relationship.findFirst({
      where: {
        sourceId,
        targetId,
        type
      }
    });

    if (existingRelationship) {
      return NextResponse.json(
        { message: 'Cette relation existe déjà' },
        { status: 400 }
      );
    }

    // Créer la relation
    const relationship = await prisma.relationship.create({
      data: {
        sourceId,
        targetId,
        type,
        weight: weight || 1,
        description
      }
    });

    // Si c'est une relation parent-enfant, créer également la relation inverse
    if (type === 'PARENT_CHILD') {
      await prisma.relationship.create({
        data: {
          sourceId: targetId,
          targetId: sourceId,
          type: 'PARENT_CHILD',
          weight: weight || 1,
          description: description || 'Relation parent-enfant'
        }
      });
    }

    return NextResponse.json({
      message: 'Relation ajoutée avec succès',
      relationship
    });
  } catch (error) {
    console.error('Erreur lors de la création de la relation:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création de la relation' },
      { status: 500 }
    );
  }
}
