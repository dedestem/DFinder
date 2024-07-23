// Retrieve a cookie by name
export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
}

// Set a cookie
export function setCookie(name, value, daysToLive) {
    let cookie = `${name}=${encodeURIComponent(value)}`;
  
    if (daysToLive) {
      let expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
      cookie += `; expires=${expirationDate.toUTCString()}`;
    }
  
    document.cookie = cookie;
}