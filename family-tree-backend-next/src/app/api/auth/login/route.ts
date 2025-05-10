import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';

/**
 * Route API pour la connexion des utilisateurs
 * @param req La requête HTTP
 * @returns La réponse HTTP avec le token JWT si la connexion est réussie
 */
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Le nom d\'utilisateur et le mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { username },
      include: { roles: true }
    });

    // Vérifier que l'utilisateur existe
    if (!user) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a été approuvé (si ce n'est pas un admin)
    const isAdmin = user.roles.some(role => role.name === 'ADMIN');
    if (!isAdmin && !user.membershipApproved) {
      return NextResponse.json(
        { message: 'Votre compte n\'a pas encore été approuvé' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Générer un token JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(role => role.name)
    });

    // Retourner le token et les informations de l'utilisateur
    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles.map(role => role.name)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
