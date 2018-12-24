import _sha1 from "sha1"; 

export const sha1 = _sha1; 

export * from "./getQuery"; 

export * from "./hmac_sha1"; 

export function escape2Html(str: string) {
    const arrEntities: { [key: string]: string } = {
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'amp': '&',
        'quot': '"'
    }

    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t: string){
        return arrEntities[t];
    });
}
