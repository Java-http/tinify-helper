import * as vscode from 'vscode';

let key = vscode.workspace.getConfiguration().get('tinify-helper.key');

/** 监听配置修改函数 */
const onConfChange = (cb:()=>void)=>{
  return vscode.workspace.onDidChangeConfiguration((event)=>{
    let newKey = vscode.workspace.getConfiguration().get('tinify-helper.key');
    if(key!==newKey){
      key = newKey;
      cb&&cb();
    }
  });
};

export {
  key,

  onConfChange
};

