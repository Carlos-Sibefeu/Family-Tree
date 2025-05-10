import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { RequestStatus } from '@prisma/client';

/**
 * Route API pour l'inscription des utilisateurs (demande d'adhésion)
 * @param req La requête HTTP
 * @returns La réponse HTTP avec le statut de la demande d'adhésion
 */
export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phoneNumber, address, reason, username, password } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!fullName || !email || !reason || !username || !password) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email ou nom d\'utilisateur est déjà utilisé' },
        { status: 400 }
      );
    }

    // Vérifier si une demande d'adhésion avec cet email existe déjà
    const existingRequest = await prisma.membershipRequest.findFirst({
      where: {
        email,
        status: RequestStatus.PENDING
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: 'Une demande d\'adhésion avec cet email est déjà en attente' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur (non approuvé)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        membershipApproved: false,
        roles: {
          connect: {
            name: 'USER'
          }
        }
      }
    });

    // Créer la demande d'adhésion
    const membershipRequest = await prisma.membershipRequest.create({
      data: {
        fullName,
        email,
        phoneNumber,
        address,
        reason,
        status: RequestStatus.PENDING,
        createdUser: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Votre demande d\'adhésion a été envoyée avec succès. Veuillez attendre l\'approbation d\'un administrateur.',
      requestId: membershipRequest.id
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
