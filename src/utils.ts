const fs = require("fs");
const tinify = require("tinify");
import {key} from './conf';

/** 验证tinify */
export function validate(){
  return new Promise((resolve)=>{ 
    if(!key){
      throw new Error("请输入key");
    }

    tinify.key = key;
    tinify.validate(function(err:any) {
      if (err) {throw err;}
      resolve();
    });
  }); 
}

/**
 * 压缩计数
 * @description API客户端会自动跟踪您本月所执行的压缩次数。验证API密钥后或在至少发出一次压缩请求后，您可以获得压缩计数。
 */
export function getTinifyCount(){
  return tinify.compressionCount;
}

/** 压缩图片 */
export function tinifyImg(file:any): Promise<{
  fileName:string,
  fileSize:number,
  tinifyFileSize:number, 
}>{
  /** 源文件路径名 */
  let fileName = file.path;
  /** 源文件大小 */
  let fileSize = 0; 
  /** 压缩后文件大小 */
  let tinifyFileSize = 0;

  return new Promise((resolve,reject)=>{ 
    fs.readFile(file.path, function(err:any, sourceData:any) {
      if (err) {return reject({err,fileName});}

      fileSize = sourceData.byteLength;

      tinify.fromBuffer(sourceData).toBuffer(function(err:any, resultData:any) {
        if (err) {return reject({err,fileName});}

        tinifyFileSize = resultData.byteLength;

        fs.writeFile(file.path, resultData, (err:any) => {
          if (err) {return reject({err,fileName});}
          
          return resolve({
            fileName,
            fileSize,
            tinifyFileSize
          });
        });
      });
    });
  }); 
}