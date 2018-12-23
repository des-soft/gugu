# 这个类是啥 

腾讯对象存储 COS 的封装


# ObjectStore Usage 

``` ts
const Bucket = 'gugugugugug'; 
const APPID = 'APPID'; 
const SecretId = 'ssss id'; 
const SecretKey = 'asdasd'; 

const os = new ObjectStorage(
    Bucket,
    APPID,
    SecretId,
    SecretKey
); 

os.upload('/love', '❤️').then(res => {
    console.log('upload success', res); 
    
    return os.download('/love')
}).then(res => {

    console.log('download success', res); 
    // => ❤️

    return os.list('/'); 
}).then(listResp => {
    const { code, data } = listResp; 

    // data 的类型是 { ListBucketResult: ListBucketResult }
    // import { ListBucketResult } from "path/to/ObjectStorage"; 
    const { ListBucketResult } = data; 

    // 条目 
    console.log(ListBucketResult.Contents); 
}).catch(err => {
    console.error('inner err', err); 
}); 
```

HAVE FUN

