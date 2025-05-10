import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour la recherche avancée dans l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les résultats de la recherche
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

    // Récupérer les paramètres de recherche
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const firstName = searchParams.get('firstName') || '';
    const lastName = searchParams.get('lastName') || '';
    const birthPlace = searchParams.get('birthPlace') || '';
    const birthDateStart = searchParams.get('birthDateStart') || '';
    const birthDateEnd = searchParams.get('birthDateEnd') || '';
    const deathDateStart = searchParams.get('deathDateStart') || '';
    const deathDateEnd = searchParams.get('deathDateEnd') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Construire la requête de recherche
    let whereClause: any = {};
    
    // Recherche générale
    if (query) {
      whereClause = {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { birthPlace: { contains: query } },
          { biography: { contains: query } }
        ]
      };
    }
    
    // Recherche par champs spécifiques
    if (firstName) {
      whereClause = {
        ...whereClause,
        firstName: { contains: firstName }
      };
    }
    
    if (lastName) {
      whereClause = {
        ...whereClause,
        lastName: { contains: lastName }
      };
    }
    
    if (birthPlace) {
      whereClause = {
        ...whereClause,
        birthPlace: { contains: birthPlace }
      };
    }
    
    // Recherche par plages de dates
    if (birthDateStart || birthDateEnd) {
      whereClause.birthDate = {};
      
      if (birthDateStart) {
        whereClause.birthDate.gte = new Date(birthDateStart);
      }
      
      if (birthDateEnd) {
        whereClause.birthDate.lte = new Date(birthDateEnd);
      }
    }
    
    if (deathDateStart || deathDateEnd) {
      whereClause.deathDate = {};
      
      if (deathDateStart) {
        whereClause.deathDate.gte = new Date(deathDateStart);
      }
      
      if (deathDateEnd) {
        whereClause.deathDate.lte = new Date(deathDateEnd);
      }
    }

    // Effectuer la recherche
    const persons = await prisma.person.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            relationshipsAsSource: true,
            relationshipsAsTarget: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      },
      skip,
      take: limit
    });

    // Compter le nombre total de résultats pour la pagination
    const totalCount = await prisma.person.count({
      where: whereClause
    });

    return NextResponse.json({
      results: persons,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la recherche' },
      { status: 500 }
    );
  }
}
