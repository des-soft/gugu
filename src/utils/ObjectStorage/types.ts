
/**
 * HTTP 标准头 
 */
export type StdHeader = {
    [key: string]: string; 
}

/**
 * HTTP 对象存储标准响应
 *   - code 状态码
 *   - data 返回响应 
 */
export type StdResp<H = StdHeader> = {
    code: number, 
    data: any, 
    headers: (H & StdHeader)
}


/**
 * os.list 的时候的结果
 */
export type ListBucketResult = {
    /**
     * 响应请求条目是否被截断，布尔值：true，false
     */
    IsTruncated: boolean, 

    /**
     * 单次响应请求内返回结果的最大的条目数量	
     */
    MaxKeys: number,
    
    /**
     * 默认以 UTF-8 二进制顺序列出条目，所有列出条目从 Marker 开始	
     */
    Marker: string, 
    
    /**
     * 说明 Bucket 的信息
     */
    Name: string, 

    /**
     * 前缀匹配，用来规定响应请求返回的文件前缀地址	
     */
    Prefix: string, 

    /**
     * 该命名空间下的条目
     */
    Contents: {
        /**
         * 资源 ETag
         */
        ETag: string, 

        /**
         * 资源键值
         */
        Key: string, 

        /**
         * 资源 LastModified
         */
        LastModified: string, 

        /**
         * 资源所有者信息
         */
        Owner: {
            DisplayName: number, 
            ID: number
        }, 

        /**
         * 资源大小 单位子节
         */
        Size: number,

        /**
         * 资源存储类型
         */
        StorageClass: string
    }[]
}


