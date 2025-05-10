import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { FamilyGraph } from '@/lib/graph/FamilyGraph';

/**
 * Route API pour récupérer les statistiques de l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les statistiques
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

    // Récupérer les statistiques de base
    const personCount = await prisma.person.count();
    const relationshipCount = await prisma.relationship.count();
    const userCount = await prisma.user.count();
    const pendingRequestCount = await prisma.membershipRequest.count({
      where: { status: 'PENDING' }
    });

    // Récupérer des statistiques plus détaillées
    const relationshipsByType = await prisma.relationship.groupBy({
      by: ['type'],
      _count: true
    });

    const personsByBirthDecade = await prisma.$queryRaw`
      SELECT 
        FLOOR(YEAR(birthDate) / 10) * 10 as decade,
        COUNT(*) as count
      FROM Person
      WHERE birthDate IS NOT NULL
      GROUP BY decade
      ORDER BY decade
    `;

    // Récupérer toutes les personnes et relations pour construire le graphe
    const persons = await prisma.person.findMany();
    const relationships = await prisma.relationship.findMany();

    // Construire le graphe familial
    const familyGraph = new FamilyGraph();
    familyGraph.buildGraph(persons, relationships);

    // Calculer des statistiques basées sur le graphe
    const graphStats = {
      nodeCount: familyGraph.getNodeCount(),
      edgeCount: familyGraph.getEdgeCount(),
      averageDegree: familyGraph.getAverageDegree(),
      diameter: familyGraph.getDiameter(),
      connectedComponents: familyGraph.getConnectedComponentsCount()
    };

    // Récupérer les personnes les plus connectées (avec le plus de relations)
    const mostConnectedPersons = await prisma.person.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            relationshipsAsSource: true,
            relationshipsAsTarget: true
          }
        }
      },
      orderBy: {
        relationshipsAsSource: {
          _count: 'desc'
        }
      },
      take: 5
    });

    return NextResponse.json({
      basicStats: {
        personCount,
        relationshipCount,
        userCount,
        pendingRequestCount
      },
      relationshipsByType,
      personsByBirthDecade,
      graphStats,
      mostConnectedPersons: mostConnectedPersons.map(person => ({
        id: person.id,
        name: `${person.firstName} ${person.lastName}`,
        connectionCount: person._count.relationshipsAsSource + person._count.relationshipsAsTarget
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
