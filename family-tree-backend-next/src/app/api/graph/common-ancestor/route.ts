import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { FamilyGraph } from '@/lib/graph/FamilyGraph';

/**
 * Route API pour trouver l'ancêtre commun le plus proche entre deux personnes
 * @param req La requête HTTP
 * @returns La réponse HTTP avec l'ancêtre commun trouvé
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
    const { person1Id, person2Id } = await req.json();

    if (!person1Id || !person2Id) {
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

    // Trouver l'ancêtre commun le plus proche
    const commonAncestor = familyGraph.findClosestCommonAncestor(person1Id, person2Id);

    if (!commonAncestor) {
      return NextResponse.json(
        { message: 'Aucun ancêtre commun trouvé entre ces deux personnes' },
        { status: 404 }
      );
    }

    // Récupérer les détails des personnes concernées
    const person1 = await prisma.person.findUnique({
      where: { id: person1Id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        deathDate: true
      }
    });

    const person2 = await prisma.person.findUnique({
      where: { id: person2Id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        deathDate: true
      }
    });

    // Trouver les chemins entre l'ancêtre commun et chaque personne
    const pathToAncestor1 = familyGraph.findShortestPath(person1Id, commonAncestor.id);
    const pathToAncestor2 = familyGraph.findShortestPath(person2Id, commonAncestor.id);

    return NextResponse.json({
      commonAncestor,
      person1,
      person2,
      pathToAncestor1,
      pathToAncestor2,
      relationshipDescription: `${person1?.firstName} ${person1?.lastName} et ${person2?.firstName} ${person2?.lastName} sont liés par leur ancêtre commun ${commonAncestor.firstName} ${commonAncestor.lastName}`
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'ancêtre commun:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la recherche de l\'ancêtre commun' },
      { status: 500 }
    );
  }
}
