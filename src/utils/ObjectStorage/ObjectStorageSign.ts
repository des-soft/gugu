import { hmac_sha1, sha1 } from "./helper"; 

/**
 * 封装腾讯云基本信息以及签名函数
 */
export class ObjectStorageSign {
    public bucket: string;
    public APPID: number;
    public SecretId: string; 
    public SecretKey: string; 
    public Where: string;
    public scheme: string = 'https'; 

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
        console.group('The ObjectStore Signature Info'); 
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
}
