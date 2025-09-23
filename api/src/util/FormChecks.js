import validator from 'validator';

const { isEmail } = validator;

export function isInvalidStringForURL(pageName) {
    const regex = /^[^/?#&]*$/;
    const trimmedPageName = pageName.trim();

    if (!trimmedPageName || !regex.test(trimmedPageName)) {
        return 'Invalid Name';
    }
}

export function isInvalidStringForUsername(username) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
        return 'Username is required';
    }

    if (trimmedUsername.length < 2) {
        return 'Username must be at least 2 characters long';
    }
}

export function isInvalidStringForPassword(password) {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 10) {
        return 'Password must be greater than 10 characters';
    }
}

export function isInvalidStringForFirstName(firstName) {
    const trimmedFirstName = firstName.trim();

    if (!trimmedFirstName) {
        return 'First name is required';
    }

    if (trimmedFirstName.length < 2) {
        return 'First name must be at least 2 characters long';
    }
}

export function isInvalidStringForLastName(lastName) {
    const trimmedLastName = lastName.trim();

    if (!trimmedLastName) {
        return 'Last name is required';
    }

    if (trimmedLastName.length < 2) {
        return 'Last name must be at least 2 characters long';
    }
}

export function isInvalidStringForEmail(email) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        return 'Email is required';
    }

    if (!isEmail(trimmedEmail)) {
        return 'Email is in a wrong format';
    }
}

