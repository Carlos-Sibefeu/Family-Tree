import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour récupérer tous les types de relations
 * @param req La requête HTTP
 * @returns La réponse HTTP avec la liste des types de relations
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

    // Récupérer tous les types de relations
    const relationshipTypes = [
      { id: 'PARENT_CHILD', name: 'Parent-Enfant', description: 'Relation entre un parent et son enfant', defaultWeight: 1 },
      { id: 'SIBLING', name: 'Frère/Sœur', description: 'Relation entre frères et sœurs', defaultWeight: 2 },
      { id: 'SPOUSE', name: 'Époux/Épouse', description: 'Relation entre époux', defaultWeight: 1 },
      { id: 'COUSIN', name: 'Cousin/Cousine', description: 'Relation entre cousins', defaultWeight: 3 },
      { id: 'UNCLE_AUNT_NEPHEW_NIECE', name: 'Oncle/Tante - Neveu/Nièce', description: 'Relation entre oncle/tante et neveu/nièce', defaultWeight: 2 },
      { id: 'GRANDPARENT_GRANDCHILD', name: 'Grand-parent - Petit-enfant', description: 'Relation entre grand-parent et petit-enfant', defaultWeight: 2 },
      { id: 'OTHER', name: 'Autre', description: 'Autre type de relation', defaultWeight: 5 }
    ];

    return NextResponse.json(relationshipTypes);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de relations:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des types de relations' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour créer un nouveau type de relation personnalisé
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les détails du type de relation créé
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

    // Vérifier que l'utilisateur est un administrateur
    const isAdmin = decodedToken.roles && decodedToken.roles.includes('ADMIN');
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Seuls les administrateurs peuvent créer des types de relations personnalisés' },
        { status: 403 }
      );
    }

    // Récupérer les données du type de relation
    const { id, name, description, defaultWeight } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!id || !name) {
      return NextResponse.json(
        { message: 'L\'identifiant et le nom sont requis' },
        { status: 400 }
      );
    }

    // Note: Dans une implémentation plus complète, on pourrait stocker les types de relations personnalisés dans la base de données
    // Pour l'instant, nous allons simplement renvoyer un message de succès

    return NextResponse.json({
      message: 'Type de relation créé avec succès',
      relationshipType: {
        id,
        name,
        description,
        defaultWeight: defaultWeight || 1,
        custom: true
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du type de relation:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création du type de relation' },
      { status: 500 }
    );
  }
}
