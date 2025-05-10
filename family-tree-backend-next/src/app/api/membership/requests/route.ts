import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Route API pour récupérer toutes les demandes d'adhésion
 * @param req La requête HTTP
 * @returns La réponse HTTP avec la liste des demandes d'adhésion
 */
export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification et les autorisations
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

    // Récupérer toutes les demandes d'adhésion
    const membershipRequests = await prisma.membershipRequest.findMany({
      include: {
        processedBy: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        createdUser: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        requestDate: 'desc'
      }
    });

    return NextResponse.json(membershipRequests);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'adhésion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des demandes d\'adhésion' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour créer une nouvelle demande d'adhésion
 * @param req La requête HTTP
 * @returns La réponse HTTP avec le statut de la demande d'adhésion
 */
export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phoneNumber, address, reason } = await req.json();

    // Vérifier que les champs requis sont présents
    if (!fullName || !email || !reason) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier si une demande d'adhésion avec cet email existe déjà
    const existingRequest = await prisma.membershipRequest.findFirst({
      where: {
        email,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: 'Une demande d\'adhésion avec cet email est déjà en attente' },
        { status: 400 }
      );
    }

    // Créer la demande d'adhésion
    const membershipRequest = await prisma.membershipRequest.create({
      data: {
        fullName,
        email,
        phoneNumber,
        address,
        reason,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      message: 'Votre demande d\'adhésion a été envoyée avec succès. Veuillez attendre l\'approbation d\'un administrateur.',
      requestId: membershipRequest.id
    });
  } catch (error) {
    console.error('Erreur lors de la création de la demande d\'adhésion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la création de la demande d\'adhésion' },
      { status: 500 }
    );
  }
}
