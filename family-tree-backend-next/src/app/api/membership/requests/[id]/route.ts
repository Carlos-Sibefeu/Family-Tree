import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { RequestStatus } from '@prisma/client';

/**
 * Route API pour récupérer une demande d'adhésion spécifique
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la demande)
 * @returns La réponse HTTP avec les détails de la demande d'adhésion
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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

    // Récupérer la demande d'adhésion
    const membershipRequest = await prisma.membershipRequest.findUnique({
      where: { id },
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
      }
    });

    if (!membershipRequest) {
      return NextResponse.json(
        { message: 'Demande d\'adhésion non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(membershipRequest);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande d\'adhésion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération de la demande d\'adhésion' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour traiter une demande d'adhésion (approuver ou rejeter)
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la demande)
 * @returns La réponse HTTP avec le statut de la demande d'adhésion
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { status } = await req.json();

    // Vérifier que le statut est valide
    if (status !== RequestStatus.APPROVED && status !== RequestStatus.REJECTED) {
      return NextResponse.json(
        { message: 'Statut invalide' },
        { status: 400 }
      );
    }

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

    // Récupérer la demande d'adhésion
    const membershipRequest = await prisma.membershipRequest.findUnique({
      where: { id },
      include: {
        createdUser: true
      }
    });

    if (!membershipRequest) {
      return NextResponse.json(
        { message: 'Demande d\'adhésion non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que la demande n'a pas déjà été traitée
    if (membershipRequest.status !== RequestStatus.PENDING) {
      return NextResponse.json(
        { message: 'Cette demande d\'adhésion a déjà été traitée' },
        { status: 400 }
      );
    }

    // Mettre à jour la demande d'adhésion
    const updatedRequest = await prisma.membershipRequest.update({
      where: { id },
      data: {
        status,
        processedDate: new Date(),
        processedBy: {
          connect: {
            id: decodedToken.id
          }
        }
      }
    });

    // Si la demande est approuvée, mettre à jour l'utilisateur
    if (status === RequestStatus.APPROVED && membershipRequest.createdUser) {
      await prisma.user.update({
        where: { id: membershipRequest.createdUser.id },
        data: {
          membershipApproved: true
        }
      });
    }

    return NextResponse.json({
      message: `La demande d'adhésion a été ${status === RequestStatus.APPROVED ? 'approuvée' : 'rejetée'} avec succès`,
      request: updatedRequest
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la demande d\'adhésion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors du traitement de la demande d\'adhésion' },
      { status: 500 }
    );
  }
}

/**
 * Route API pour supprimer une demande d'adhésion
 * @param req La requête HTTP
 * @param params Les paramètres de la route (id de la demande)
 * @returns La réponse HTTP avec le statut de la suppression
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

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

    // Vérifier que la demande existe
    const membershipRequest = await prisma.membershipRequest.findUnique({
      where: { id }
    });

    if (!membershipRequest) {
      return NextResponse.json(
        { message: 'Demande d\'adhésion non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la demande d'adhésion
    await prisma.membershipRequest.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'La demande d\'adhésion a été supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande d\'adhésion:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la suppression de la demande d\'adhésion' },
      { status: 500 }
    );
  }
}
