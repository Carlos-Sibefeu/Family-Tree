import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { FamilyGraph } from '@/lib/graph/FamilyGraph';

/**
 * Route API pour trouver le chemin le plus court entre deux personnes en utilisant l'algorithme de Bellman-Ford
 * @param req La requête HTTP
 * @returns La réponse HTTP avec le chemin trouvé
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

    // Récupérer les IDs des personnes
    const { sourceId, targetId } = await req.json();

    if (!sourceId || !targetId) {
      return NextResponse.json(
        { message: 'Les IDs des deux personnes sont requis' },
        { status: 400 }
      );
    }

    // Récupérer toutes les personnes et relations pour construire le graphe
    const persons = await prisma.person.findMany();
    const relationships = await prisma.relationship.findMany();

    // Construire le graphe familial
    const familyGraph = new FamilyGraph();
    familyGraph.buildGraph(persons, relationships);

    // Trouver le chemin le plus court en utilisant l'algorithme de Bellman-Ford
    const shortestPath = familyGraph.findShortestPathBellmanFord(sourceId, targetId);

    if (!shortestPath) {
      return NextResponse.json(
        { message: 'Aucun chemin trouvé entre ces deux personnes' },
        { status: 404 }
      );
    }

    // Récupérer les détails des personnes dans le chemin
    const pathPersons = await Promise.all(
      shortestPath.nodes.map(async (nodeId) => {
        return await prisma.person.findUnique({
          where: { id: nodeId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            deathDate: true
          }
        });
      })
    );

    // Construire la description du chemin
    const pathDescription = [];
    for (let i = 0; i < shortestPath.edges.length; i++) {
      const edge = shortestPath.edges[i];
      const sourcePerson = pathPersons[i];
      const targetPerson = pathPersons[i + 1];

      if (sourcePerson && targetPerson) {
        pathDescription.push({
          from: `${sourcePerson.firstName} ${sourcePerson.lastName}`,
          to: `${targetPerson.firstName} ${targetPerson.lastName}`,
          relationshipType: edge.relationshipType,
          weight: edge.weight
        });
      }
    }

    return NextResponse.json({
      path: shortestPath,
      persons: pathPersons,
      description: pathDescription,
      totalWeight: shortestPath.totalWeight,
      algorithm: 'Bellman-Ford'
    });
  } catch (error) {
    console.error('Erreur lors de la recherche du chemin le plus court avec Bellman-Ford:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la recherche du chemin le plus court' },
      { status: 500 }
    );
  }
}
