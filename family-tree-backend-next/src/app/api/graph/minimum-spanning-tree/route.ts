import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { FamilyGraph } from '@/lib/graph/FamilyGraph';

/**
 * Route API pour trouver l'arbre couvrant minimal de l'arbre généalogique
 * @param req La requête HTTP
 * @returns La réponse HTTP avec l'arbre couvrant minimal
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

    // Récupérer le paramètre de l'algorithme à utiliser (Prim ou Kruskal)
    const { searchParams } = new URL(req.url);
    const algorithm = searchParams.get('algorithm') || 'prim';

    // Récupérer toutes les personnes et relations pour construire le graphe
    const persons = await prisma.person.findMany();
    const relationships = await prisma.relationship.findMany();

    // Construire le graphe familial
    const familyGraph = new FamilyGraph();
    familyGraph.buildGraph(persons, relationships);

    // Trouver l'arbre couvrant minimal
    const mst = algorithm.toLowerCase() === 'kruskal' 
      ? familyGraph.findMinimumSpanningTreeKruskal()
      : familyGraph.findMinimumSpanningTree();

    // Récupérer les détails des personnes et construire les arêtes de l'arbre
    const mstEdges = [];
    for (const edge of mst) {
      const sourcePerson = persons.find(p => p.id === edge.targetId);
      
      if (sourcePerson) {
        mstEdges.push({
          source: edge.targetId,
          sourceName: `${sourcePerson.firstName} ${sourcePerson.lastName}`,
          target: edge.targetId,
          relationshipType: edge.relationshipType,
          weight: edge.weight
        });
      }
    }

    return NextResponse.json({
      algorithm: algorithm.toLowerCase() === 'kruskal' ? 'Kruskal' : 'Prim',
      mst: mstEdges,
      totalWeight: mstEdges.reduce((sum, edge) => sum + edge.weight, 0)
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'arbre couvrant minimal:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la recherche de l\'arbre couvrant minimal' },
      { status: 500 }
    );
  }
}
