import validator from 'validator';

const { isEmail } = validator;

export function isInvalidStringForURL(pageName: string): string | undefined {
  const regex = /^[a-zA-Z0-9_]+$/;

  if (!pageName || !regex.test(pageName)) {
    return 'Invalid name';
  }
}

export function isInvalidStringForUsername(username: string): string | undefined {
  const regex = /^[a-zA-Z0-9_]+$/;

  if (!username || !regex.test(username)) {
    return 'Invalid username format';
  }

  if (username.length < 2) {
    return 'Username must be at least 2 characters long';
  }
}

export function isInvalidStringForPassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 10) {
    return 'Password must be at least 10 characters long';
  }
}

export function isInvalidStringForFirstName(firstName: string): string | undefined {
  if (!firstName) {
    return 'First name is required';
  }

  if (firstName.length < 2) {
    return 'First name must be at least 2 characters long';
  }
}

export function isInvalidStringForLastName(lastName: string): string | undefined {
  if (!lastName) {
    return 'Last name is required';
  }

  if (lastName.length < 2) {
    return 'Last name must be at least 2 characters long';
  }
}

export function isInvalidStringForEmail(email: string): string | undefined {
  if (!email) {
    return 'Email is required';
  }

  if (!isEmail(email)) {
    return 'Email is in a wrong format';
  }
}
