import * as crypto from "crypto-js"; 

/**
 * hmac sha1 
 * @param content 要 hash 的内容
 * @param key 密钥
 */
export function hmac_sha1(content: string, key: string) {
    // console.log('crypto.HmacSHA1(content, key)', crypto.HmacSHA1(content, key).toString()); 
    return crypto.HmacSHA1(content, key).toString(); 
}
