import { ObjectStorageBase } from "./ObjectStorageBase";
import { getQuery, QueryObj } from "./helper";
import { ListBucketResult } from "./types";

/**
 * 在 ObjectStorageBase 的基础上进一步封装
 */
export class ObjectStorage extends ObjectStorageBase {
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

    /**
     * get key列表
     * @param ns 命名空间
     * @param number 数量, 不填为全部
     */
    list(ns: string, maxKeys?: number) {
        const query: QueryObj = {}

        // 参数处理
        if (ns[0] === '/') ns = ns.substring(1); 
        if (ns) query.prefix = ns;
        if (maxKeys) query['max-keys'] = maxKeys; 

        // qs 处理
        let qs = getQuery.toString(query);
        qs = qs ? '?' + qs : qs; 

        // 发送请求
        return this.send(
            'GET',
            `/${ qs }`
        ).then(res => {
            if (!res.data.ListBucketResult.Contents) {
                res.data.ListBucketResult.Contents = []; 
            }

            if (!Array.isArray(res.data.ListBucketResult.Contents)) {
                res.data.ListBucketResult.Contents = [res.data.ListBucketResult.Contents]; 
            }

            return {
                code: res.code, 
                data: res.data as { ListBucketResult: ListBucketResult }
            }
        })
    }
}
