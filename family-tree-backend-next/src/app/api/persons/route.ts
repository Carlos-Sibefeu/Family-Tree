import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour récupérer toutes les personnes de l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec la liste des personnes
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
    const search = searchParams.get('search');
    
    // Construire la requête de recherche
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { birthPlace: { contains: search } }
        ]
      };
    }

    // Récupérer toutes les personnes
    const persons = await prisma.person.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    });

    return NextResponse.json(persons);
  } catch (error) {
    console.error('Erreur lors de la récupération des personnes:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des personnes' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour créer une nouvelle personne dans l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les détails de la personne créée
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
        { message: 'Vous n\'êtes pas autorisé à ajouter des personnes' },
        { status: 403 }
      );
    }

    // Récupérer les données de la personne
    const {
      firstName,
      lastName,
      birthDate,
      deathDate,
      birthPlace,
      biography,
      parentIds
    } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: 'Le prénom et le nom sont requis' },
        { status: 400 }
      );
    }

    // Créer la personne
    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        birthPlace,
        biography,
        createdBy: {
          connect: {
            id: decodedToken.id
          }
        }
      }
    });

    // Ajouter les relations parent-enfant si des parents sont spécifiés
    if (parentIds && parentIds.length > 0) {
      for (const parentId of parentIds) {
        // Créer la relation dans les deux sens
        await prisma.relationship.create({
          data: {
            sourceId: person.id,
            targetId: parentId,
            type: 'PARENT_CHILD'
          }
        });
        
        await prisma.relationship.create({
          data: {
            sourceId: parentId,
            targetId: person.id,
            type: 'PARENT_CHILD'
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Personne ajoutée avec succès',
      person
    });
  } catch (error) {
    console.error('Erreur lors de la création de la personne:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création de la personne' },
      { status: 500 }
    );
  }
}
