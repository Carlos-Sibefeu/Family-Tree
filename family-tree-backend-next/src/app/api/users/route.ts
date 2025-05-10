import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/auth/password';

/**
 * Route API pour récupérer tous les utilisateurs
 * @param req La requête HTTP
 * @returns La réponse HTTP avec la liste des utilisateurs
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

    // Vérifier que l'utilisateur est un administrateur
    const isAdmin = decodedToken.roles && decodedToken.roles.includes('ADMIN');
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
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
          { username: { contains: search } },
          { email: { contains: search } }
        ]
      };
    }

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        membershipApproved: true,
        createdAt: true,
        updatedAt: true,
        membershipRequests: {
          select: {
            id: true,
            status: true,
            requestDate: true
          }
        }
      },
      orderBy: {
        username: 'asc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour créer un nouvel utilisateur
 * @param req La requête HTTP
 * @returns La réponse HTTP avec les détails de l'utilisateur créé
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
        { message: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les données de l'utilisateur
    const { username, email, password, roles, membershipApproved } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier si un utilisateur avec ce nom d'utilisateur ou cet email existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: roles || ['USER'],
        membershipApproved: membershipApproved !== undefined ? membershipApproved : false
      },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
        membershipApproved: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}
