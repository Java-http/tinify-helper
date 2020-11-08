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
			outputChannel.appendLine(`压缩完成!`);
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
				/** 图片总数 */
				const count = files.length;
				/** 图片计数(含压缩成功和失败次数) */
				const result = {succ:0,fail:0};

        files.map((item) => {
					tinifyImg(item).then((re)=>{
						outputChannel.appendLine(`${re.fileName} - ${filesize(re.fileSize)} -> ${filesize(re.tinifyFileSize)} 减少 ${filesize(re.fileSize - re.tinifyFileSize)}`);

						result.succ++;
						if(result.succ + result.fail >= count){
							outputChannel.appendLine(`压缩完成! 成功:${result.succ}张 失败:${result.fail}张`);
						}
					}).catch((err)=>{
						outputChannel.appendLine(`${err.fileName} 压缩报错: ${err.err}`);

						result.fail++;
						if(result.succ + result.fail >= count){
							outputChannel.appendLine(`压缩完成! 成功:${result.succ}张 失败:${result.fail}张`);
						}
					});
				});
			});
	}
}
