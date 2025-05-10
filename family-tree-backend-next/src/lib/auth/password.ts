import bcrypt from 'bcryptjs';

/**
 * Hache un mot de passe en utilisant bcrypt
 * @param password Le mot de passe en clair
 * @returns Le mot de passe haché
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare un mot de passe en clair avec un mot de passe haché
 * @param password Le mot de passe en clair
 * @param hashedPassword Le mot de passe haché
 * @returns true si les mots de passe correspondent, false sinon
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
