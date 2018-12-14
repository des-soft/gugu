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
}).catch(err => {
    console.error('inner err', err); 
}); 
```

HAVE FUN

