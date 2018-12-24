import { parse } from "fast-xml-parser";

import he from "he"; 

import _sha1 from "sha1"; 

export const sha1 = _sha1; 

export const xmlParse = (xmlData: string) => parse(xmlData, {
    tagValueProcessor: he.decode
});

export const decode = he.decode;

export * from "./getQuery"; 

export * from "./hmac_sha1"; 


