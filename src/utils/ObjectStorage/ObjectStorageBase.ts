import sha1 from "sha1"; 
import { hmac_sha1 } from "./hmac_sha1"; 
import { parse as xmlParse } from "fast-xml-parser";
import getQuery from "./getQuery";
import { StdHeader, StdResp, RawResp } from "./types";

export class ObjectStorageBase {
    private bucket: string;
    private APPID: number;
    private SecretId: string; 
    private SecretKey: string; 
    private Where: string;
    private scheme: string = 'https'; 

    setScheme(newScheme: string) {
        this.scheme = newScheme; 
    }

    get Host() {
        return `${ this.bucket }-${ this.APPID }.cos.${ this.Where }.myqcloud.com`;
    }

    get FileHost() {
        return `${ this.Where }.file.myqcloud.com`; 
    }

    /**
     * 构造一个对象存储
     * @param bucket      对象存储桶名
     * @param APPID       对象存储 APPID
     * @param SecretId    对象存储 SecretId
     * @param SecretKey   对象存储 SecretKey
     * @param Where       对象存储 Where (比如 'ap-guangzhou')
     */
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
     * 计算 headers.Authorization
     *   - 对签名的有效起止时间加密计算值 SignKey。
     *   - 根据固定格式组合生成 HttpString。
     *   - 加密 HttpString，并根据固定格式组合生成 StringToSign。
     *   - 加密 StringToSign，生成 Signature。
     * @param method           http 方法
     * @param body             http content
     * @param httpUri          你要发的 url
     * @param httpHeaders      http headers 字符串 请参考腾讯云文档, 或者 this.send
     * @param httpParameters   http 查询参数文档 请参考腾讯云文档，或者 this.send
     *                         此处一般没有参数因此这个值一般是 ''
     * @param headerList       headerList 参考文档或者 this.send, 默认为 ''
     * @param urlParamList     参考文档或者 this.send 此处也一般为 '' 
     */
    ofHeaderAuth(
        method: string, 
        httpUri: string, 
        httpHeaders: string,
        httpParameters: string = '', 
        headerList: string = '',
        urlParamList: string = ''
    ) {
        console.groupCollapsed('The ObjectStore Signature Info'); 
        const ts_start = Math.floor(Date.now() / 1000); 
        const ts_end = ts_start + 60; 
        const signTime = `${ ts_start };${ ts_end }`; 
        const signKey = hmac_sha1(signTime, this.SecretKey); 

        // [HttpMethod]\n[HttpURI]\n[HttpParameters]\n[HttpHeaders]\n
        const httpString = [
            method.toLowerCase(), 
            httpUri.split('?')[0], 
            httpParameters, 
            httpHeaders
        ].join('\n') + '\n';

        const sha1edHttpString = sha1(httpString); 

        const stringToSign = `sha1\n${ signTime }\n${ sha1edHttpString }\n`; 
        
        const signature = hmac_sha1(stringToSign, signKey);

        console.log('httpString Detail', [
            'method: ' + method.toLowerCase(), 
            'httpUri: ' + httpUri, 
            'httpParameters: ' + httpParameters, 
            'httpHeaders: ' + httpHeaders
        ]); 

        console.log('headers.Authorization Detail', [
            `q-sign-algorithm=sha1`,
            `q-ak=${ this.SecretId }`,
            `q-sign-time=${ signTime }`,
            `q-key-time=${ signTime }`,
            `q-header-list=${ headerList }`,
            `q-url-param-list=${ urlParamList }`,
            `q-signature=${ signature }`
        ]); 
        
        console.groupEnd(); 
        return [
            `q-sign-algorithm=sha1`,
            `q-ak=${ this.SecretId }`,
            `q-sign-time=${ signTime }`,
            `q-key-time=${ signTime }`,
            `q-header-list=${ headerList }`,
            `q-url-param-list=${ urlParamList }`,
            `q-signature=${ signature }`
        ].join('&'); 
    }

    /**
     * 往对象存储发送请求
     * @param method   HTTP 方法
     * @param objpath  对象 Key
     * @param json     对象内容，字符串形式
     */
    send(method: string, objpath: string, json: string = ''): Promise<StdResp> {
        const logGrpNam =
            ` %c [${new Date().toLocaleTimeString()}] ObjectStore%c ${ method.toUpperCase() }%c ${ objpath } `
        console.groupCollapsed(
            logGrpNam, 
            `background: #6E9;color: #222`,
            `background: #6E9;color: #F00;`,
            `background: #6E9;color: #F00`
        );
        const query = getQuery(objpath); 

        const headers: StdHeader = {
            Host: this.Host,
        }

        // 如果是 PUT，则要计算 json 的 sha 作签名用
        if (method === 'PUT') {
            headers['x-cos-storage-class'] = 'standard'; 
            headers['x-cos-content-sha1'] = sha1(json).toString(); 
        }

        
        // 利用 ofHeaderAuth 计算签名 
        headers.Authorization = this.ofHeaderAuth(
            method.toUpperCase(), 
            objpath,
            Object.keys(headers).sort().map(
                key => `${key.toLowerCase()}=${encodeURIComponent(headers[key])}`
            ).join('&'),
            // Object.keys(query).map(e => e.toLowerCase()).sort().join(';'), 
            Object.keys(query).map(key => {
                const value = query[key]; 
                const t = `${key.toLowerCase()}=${ encodeURIComponent(value.toString()) }`; 
                return t; 
            }).sort().join('&'),
            Object.keys(headers).map(e => e.toLowerCase()).sort().join(';'),
            Object.keys(query).map(e => e.toLowerCase()).sort().join(';')
        ); 

        console.groupCollapsed('Header Details');
        console.log(headers); 
        console.groupEnd();

        console.groupEnd();
        // 发起请求
        return fetch(`${ this.scheme }://${ this.Host }${ objpath }`, {
            method, 
            body: json, 
            headers
        }).then(ok => {
            console.groupCollapsed(
                ` %c [${new Date().toLocaleTimeString()}] ObjectStore %c${method.toUpperCase()}%c ${objpath} ${ok.status}`,
                `background: #222;color: #6E9`,
                `background: #222;color: #FA9`,
                `background: #222;color: #FA9`
            );

            // 第一级处理，吧状态码和http返回的字符串收集起来
            return ok.text().then(data => {
                
                return {
                    data: data.trim(), 
                    code: ok.status
                }
            })
        }).then(
            // 二级处理，输出标准输出 
            this.responseProcess
        ).then(response => {
            console.log(response);
            console.groupEnd();
            return response; 
        }).catch(err => {
            console.error('%c ObjectStore Put Error', `background: #222;color: #F00`); 
            console.log(err); 
            console.groupEnd();
            return Promise.reject(err); 
        });
    }

    /**
     * 标准响应处理器
     */
    responseProcess = (res: RawResp): StdResp => {
        const { code, data } = res; 
        let processed; 

        if (data === '') {
            // 上传成功的时候，只返回状态码 200 和一个空字符串
            processed = {}
        } else {
            if (data[0] === '<') { // it is xml 
                processed = xmlParse(data); 
            } else {               // else it is json 
                processed = JSON.parse(data); 
            }
        }
        
        return {
            code,
            data: processed
        } as StdResp
    }
}