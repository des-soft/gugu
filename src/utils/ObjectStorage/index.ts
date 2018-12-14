import sha1 from "sha1"; 
import { hmac_sha1 } from "./hmac_sha1"; 
import { parse as xmlParse } from "fast-xml-parser";

/**
 * HTTP 标准头 
 */
export type StdHeader = {
    [key: string]: string
}

/**
 * HTTP 对象存储标准响应
 *   - code 状态码
 *   - data 返回响应 
 */
export type StdResp = {
    code: number, 
    data: any
}

/**
 * HTTP 生响应 
 *   - code 为 http 状态码
 *   - data 为 http response body 的文本形式
 */
export type RawResp = {
    code: number, 
    data: string // 
}

/**
 * 该类提供了方便可用的对象存储抽象
 */
export class ObjectStorage {
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
        const ts_start = Math.floor(Date.now() / 1000); 
        const ts_end = ts_start + 60; 
        const signTime = `${ ts_start };${ ts_end }`; 
        const signKey = hmac_sha1(signTime, this.SecretKey); 

        // [HttpMethod]\n[HttpURI]\n[HttpParameters]\n[HttpHeaders]\n
        const httpString = [
            method.toLowerCase(), 
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
            '', 
            Object.keys(headers).map(e => e.toLowerCase()).sort().join(';'),
            ''
        ); 

        console.log('headers', headers); 
        
        // 发起请求
        return fetch(`${ this.scheme }://${ this.Host }${ objpath }`, {
            method, 
            body: json, 
            headers
        }).then(ok => {
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
            console.log('ObjectStore Put Success', objpath, response);
            return response; 
        }).catch(err => {
            console.error('ObjectStore Put Error', objpath, err); 
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

    /**
     * put 一个对象到对象存储去
     * @param objpath 在对象存储的路径 
     * @param obj 你想传的对象 
     */
    upload(objpath: string, obj: object | string) {
        return this.send('PUT', objpath, JSON.stringify(obj)); 
    }

    /**
     * get 一个对象
     * @param objpath 在对象存储的路径 
     */
    download(objpath: string) {
        return this.send('GET', objpath); 
    }
}

