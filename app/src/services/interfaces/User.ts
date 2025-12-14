/**
 * @file User.ts
 * @description
 * Represents a user in the system.
 *
 * @property {string} username - The unique username of the user
 * @property {string} email - The user's email address
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {boolean} twoFactorAuthOn - Whether two-factor authentication is enabled
 */
class User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    twoFactorAuthOn: boolean;
}

export default User;
