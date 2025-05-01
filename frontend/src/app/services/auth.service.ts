import { ApiService } from './api.service';

/**
 * Service pour gérer l'authentification et les utilisateurs
 */
export class AuthService {
  /**
   * Vérifie si l'utilisateur est connecté
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!token && !!user;
  }

  /**
   * Récupère l'utilisateur connecté
   */
  static getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    
    return user.roles.includes(role);
  }

  /**
   * Connecte l'utilisateur
   */
  static async login(username: string, password: string): Promise<any> {
    try {
      const response = await ApiService.auth.login(username, password);
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles
      }));
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Inscrit un nouvel utilisateur
   */
  static async register(username: string, email: string, password: string): Promise<any> {
    try {
      return await ApiService.auth.register(username, email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Simule une connexion (pour le développement sans backend)
   */
  static simulateLogin(username: string, password: string): void {
    // Simuler un token JWT
    const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
    
    // Simuler un utilisateur
    const fakeUser = {
      id: 1,
      username,
      email: `${username}@example.com`,
      roles: ['ROLE_USER']
    };
    
    // Stocker les données simulées
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));
  }
}
