import sha1 from "sha1"; 
import { hmac_sha1 } from "./hmac_sha1"; 
import { parse as xmlParse } from "fast-xml-parser";

export type StdHeader = {
    [key: string]: string
}

export class ObjectStorage {
    bucket: string;
    APPID: number;
    SecretId: string; 
    SecretKey: string; 
    Where: string;

    constructor(
        bucket: string, APPID: number,
        SecretId: string, SecretKey: string, 
        Where: string = 'ap-guangzhou'
    ) {
        this.bucket = bucket;
        this.APPID = APPID; 
        this.SecretId = SecretId; 
        this.SecretKey = SecretKey; 
        this.Where = Where; 
    }

    /**
     * 对签名的有效起止时间加密计算值 SignKey。
     * 根据固定格式组合生成 HttpString。
     * 加密 HttpString，并根据固定格式组合生成 StringToSign。
     * 加密 StringToSign，生成 Signature。
     * @param body 
     * @param body 
     */
    ofHeaderAuth(
        method: string, 
        body: string,
        httpUri: string, 
        httpHeaders: string,
        httpParameters: string = '', 
        headerList: string = '',
        urlParamList: string = ''
    ) {
        const ts_start = Math.floor(Date.now() / 1000); 
        const ts_end = ts_start + 30; 
        const signTime = `${ ts_start };${ ts_end }`; 

        const signKey = hmac_sha1(signTime, this.SecretKey); 

        // [HttpMethod]\n[HttpURI]\n[HttpParameters]\n[HttpHeaders]\n
        const httpString = [
            method.toUpperCase(), 
            httpUri, 
            httpParameters, 
            httpHeaders
        ].join('\n') + '\n'; 

        const sha1edHttpString = sha1(httpString); 

        const stringToSign = `sha1\n${ signTime }\n${ sha1edHttpString }\n`; 
        
        const signature = hmac_sha1(stringToSign, signKey);
       
        return [
            `q-sign-algorithm=sha1`,
            `q-ak=${ this.SecretId }`,
            `q-sign-time=${ signTime }`,
            `q-key-time=${ signTime }`,
            `q-header-list=${ headerList }`,
            `q-url-param-list=${ urlParamList }`,
            `q-signature=[${ signature }]`
        ].join('&'); 
    }

    upload(objpath: string, obj: object) {
        const json = JSON.stringify(obj); 
        const method = 'PUT'; 
        const Host = `${ this.bucket }-${ this.APPID }.cos.${ this.Where }.myqcloud.com`;

        const headers: StdHeader = {
            Host
        }

        headers.Authorization = this.ofHeaderAuth(
            'PUT', json, objpath,
            Object.keys(headers).map(
                key => `${key}=${encodeURIComponent(headers[key])}`
            ).join('&'),
            '', 
            Object.keys(headers).map(e => e.toLowerCase()).sort().join(''),
            ''
        ); 

        return fetch(`http://${ Host }${ objpath }`, {
            method: 'PUT', 
            body: json, 
            headers
        }).then(ok => {
            return ok.text()
        }).then(text => {
            return xmlParse(text); 
        })
    }
}

