import { isEmail } from 'validator';

/**
 *
 * @param pageName
 */
export function isInvalidStringForURL(pageName){
  const regex = /^[a-zA-Z0-9_]+$/;

  if (!pageName || !regex.test(pageName)) {
    return 'Invalid name';
  }
}

/**
 *
 * @param username
 */
export function isInvalidStringForUsername(username){
  const regex = /^[a-zA-Z0-9_]+$/;

  if (!username || !regex.test(username)) {
    return 'Invalid username format';
  }

  if (username.length < 2) {
    return 'Username must be at least 2 characters long';
  }
}

/**
 *
 * @param password
 */
export function isInvalidStringForPassword(password){
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 10) {
    return 'Password must be at least 10 characters long';
  }
}

/**
 *
 * @param firstName
 */
export function isInvalidStringForFirstName(firstName){
  if (!firstName) {
    return 'First name is required';
  }

  if (firstName.length < 2) {
    return 'First name must be at least 2 characters long';
  }
}

/**
 *
 * @param lastName
 */
export function isInvalidStringForLastName(lastName){
  if (!lastName) {
    return 'Last name is required';
  }

  if (lastName.length < 2) {
    return 'Last name must be at least 2 characters long';
  }
}

/**
 * Checks whether is invalid string for email.
 *
 * @param {any} email - The email value.
 */
export function isInvalidStringForEmail(email){
  if (!email) {
    return 'Email is required';
  }

  if (!isEmail(email)) {
    return 'Email is in a wrong format';
  }
}
