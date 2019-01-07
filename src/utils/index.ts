export function formatTime(timestamp: number, format: string = 'YYYY-MM-DD HH:mm'){
    let D = new Date(timestamp);
    interface Rules {
        [propName: string]: () => string | number
    }
    const rules: Rules = {
        'YYYY': () => D.getFullYear(),
        'MM': () => String(D.getMonth() + 1).padStart(2, '0'),
        'DD': () => String(D.getDate()).padStart(2, '0'),
        'HH': () => String(D.getHours()).padStart(2, '0'),
        'mm': () => String(D.getMinutes()).padStart(2, '0'),
        'ss': () => String(D.getSeconds()).padStart(2, '0'),
    }
    let value = format;
    Object.keys(rules).forEach(key => {
        value = value.replace(new RegExp(key,'g'), rules[key]() + '');
    })
    return value
}