import { parse as xmlParse } from "fast-xml-parser";
import { getQuery, sha1, escape2Html } from "./helper"; 
import { StdHeader, StdResp } from "./types";
import { ObjectStorageSign } from "./ObjectStorageSign";

/**
 * 利用 ObjectStorageSign 并配合 fetch api 完成对腾讯云的访问
 */
export class ObjectStorageBase extends ObjectStorageSign {
    /**
     * 往对象存储发送请求
     * @param method   HTTP 方法
     * @param objpath  对象 Key
     * @param json     对象内容，字符串形式
     */
    send(method: string, objpath: string, json: string = ''): Promise<StdResp> {
        // Logger 
        const logGrpNam =
            ` %c [${new Date().toLocaleTimeString()}] ObjectStore%c ${ method.toUpperCase() }%c ${ objpath } `
        console.group(
            logGrpNam, 
            `background: #6E9;color: #222`,
            `background: #6E9;color: #F00;`,
            `background: #6E9;color: #F00`
        );
        ////////// 

        // 获取 objpath 中的 query object，并转为对象
        const query = getQuery(objpath); 

        // 创建 headers
        const headers: StdHeader = {
            Host: this.Host,
        }

        // 如果是 PUT，则要计算 json 的 sha 作签名用
        if (method === 'PUT') {
            headers['x-cos-storage-class'] = 'standard'; 
            headers['x-cos-content-sha1'] = sha1(json).toString(); 
        }

        // 利用 ofHeaderAuth 计算签名 ofHeaderAuth 来自于 ObjectStorageSign 类
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

        console.group('Header Details');
        console.log(headers); 
        console.groupEnd();

        console.groupEnd();
        // 发起请求
        return fetch(`${ this.scheme }://${ this.Host }${ objpath }`, {
            method, 
            body: json, 
            headers
        }).then(ok => {
            console.group(
                ` %c [${new Date().toLocaleTimeString()}] ObjectStore %c${method.toUpperCase()}%c ${objpath} ${ok.status}`,
                `background: #222;color: #6E9`,
                `background: #222;color: #FA9`,
                `background: #222;color: #FA9`
            );

            const headers: StdHeader = {}
                        
            ok.headers.forEach((val: string, key: string) => {
                headers[key] = escape2Html(val); 
            }); 

            // 第一级处理，吧状态码和http返回的字符串收集起来
            return ok.text().then(data => ({
                data: data.trim(), 
                code: ok.status,
                headers            
            }))
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
    responseProcess = (res: StdResp): StdResp => {
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
            data: processed, 
            headers: res.headers
        } as StdResp<any>
    }
}
