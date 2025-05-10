import jwt from 'jsonwebtoken';

// Clé secrète pour signer les JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_jwt_pour_arbre_genealogique';

// Durée de validité du token (24 heures)
const JWT_EXPIRES_IN = '24h';

/**
 * Génère un token JWT pour un utilisateur
 * @param payload Les données à inclure dans le token
 * @returns Le token JWT généré
 */
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Vérifie et décode un token JWT
 * @param token Le token JWT à vérifier
 * @returns Les données décodées du token ou null si le token est invalide
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
