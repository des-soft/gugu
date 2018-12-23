export type QueryObj = {
    [key: string]: string | number
}

export default function getQuery(path: string): QueryObj {
    const [ , query] = path.split('?');

    if (!query) return {}; 

    return query.split('&').reduce((obj, kv) => {
        const [k, v] = kv.split('=');
        obj[k] = v; 
        return obj; 
    }, {} as QueryObj); 
}

getQuery.toString = function(query: QueryObj) {
    return Object.keys(query).map(key => {
        return `${ key }=${ query[key] }`; 
    }).join('&'); 
}
