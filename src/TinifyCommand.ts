import {
	window,
	workspace,
	RelativePattern,
} from "vscode";
const  filesize = require('filesize');

import { tinifyImg,getTinifyCount,validate } from "./utils";

export default class {

	/** 验证 */
	validate(){
		return validate().catch((err)=>{
			window.showErrorMessage("当前tinify验证错误!",err);
			throw err;
		});
	}

	/** 选中图片压缩 */
	async tinifyImage(folder:any){
		const outputChannel = window.createOutputChannel('tinify-helper');
		outputChannel.show();
		outputChannel.appendLine(`当前key值已使用次数: ${getTinifyCount()}`);
		outputChannel.appendLine(`正在压缩图片,请稍候......`);

		tinifyImg(folder).then((re)=>{
			outputChannel.appendLine(`${re.fileName} - ${filesize(re.fileSize)} -> ${filesize(re.tinifyFileSize)} 减少 ${filesize(re.fileSize - re.tinifyFileSize)}`);
		}).catch((err)=>{
			outputChannel.appendLine(`${err.fileName} 压缩报错: ${err.err}`);
		});
	}

	/** 选中文件夹压缩 */
	async tinifyImages(folder:any) {
		workspace
			.findFiles(new RelativePattern(folder.path, `**/*.{png,jpg,jpeg}`))
			.then((files) => {
				const outputChannel = window.createOutputChannel('tinify-helper');
				outputChannel.show();
				outputChannel.appendLine(`当前key值已使用次数: ${getTinifyCount()}`);
				outputChannel.appendLine(`正在压缩图片,请稍候......`);

        files.map((item) => {
					tinifyImg(item).then((re)=>{
						outputChannel.appendLine(`${re.fileName} - ${filesize(re.fileSize)} -> ${filesize(re.tinifyFileSize)} 减少 ${filesize(re.fileSize - re.tinifyFileSize)}`);
					}).catch((err)=>{
						outputChannel.appendLine(`${err.fileName} 压缩报错: ${err.err}`);
					});
				});
			});
	}
}
