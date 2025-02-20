export function isValidStringForURL(pageName){
    const regex = /^[^/?#&]*$/;

    return regex.test(name);
}