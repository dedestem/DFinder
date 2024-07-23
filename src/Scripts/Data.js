export function Save(Value, Key) {
    localStorage.setItem(Key, JSON.stringify(Value));
}

export function Load(Key) {
    return JSON.parse(localStorage.getItem(Key)) || [];
} 