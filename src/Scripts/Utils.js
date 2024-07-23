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

export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    let hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

export function toBoolean(value) {
  return value === 'true' || value === true;
}