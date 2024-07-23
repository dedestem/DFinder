export function Save(Value, Key) {
    localStorage.setItem(Key, JSON.stringify(Value));
}

export function Load(Key) {
    return JSON.parse(localStorage.getItem(Key)) || null;
} 

export function SaveRaw(Value, Key) {
    localStorage.setItem(Key,Value);
}

export function LoadRaw(Key) {
    return localStorage.getItem(Key) || null;
}