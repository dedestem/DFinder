let settingstransparent = JSON.parse(localStorage.getItem('settings-transparent')) || [];

export function changetransparentsetting(value) {
    localStorage.setItem('settings-transparent', JSON.stringify(value));
}

export function getrecent() {
    console.log(settingstransparent);
    return settingstransparent;
};