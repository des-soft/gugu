export function formatTime(timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss'){
    let D = new Date(timestamp);
    interface Rules {
        [propName: string]: () => string | number
    }
    const rules: Rules = {
        'YYYY': () => D.getFullYear(),
        'MM': () => D.getMonth() + 1,
        'DD': () => D.getDate(),
        'HH': () => D.getHours(),
        'mm': () => D.getMinutes(),
        'ss': () => D.getSeconds(),
    }
    let value = format;
    Object.keys(rules).forEach(key => {
        value = value.replace(new RegExp(key,'g'), rules[key]() + '');
    })
    return value
}