import * as vscode from 'vscode';
import TinifyCommand from './TinifyCommand';
import {onConfChange} from './conf';

const tinifyCommand = new TinifyCommand();

let watcher:any;
let tinifyImagesDisposable:vscode.Disposable;
let tinifyImageDisposable:vscode.Disposable;

/** 订阅 */
const subscripe = async ()=>{
	tinifyImagesDisposable?.dispose();
	tinifyImageDisposable?.dispose();

	await tinifyCommand.validate();

	tinifyImagesDisposable = vscode.commands.registerCommand('tinify-helper.tinifyImages', (folder) => {
		tinifyCommand.tinifyImages(folder);
	});
	tinifyImageDisposable = vscode.commands.registerCommand('tinify-helper.tinifyImage', (folder) => {
		tinifyCommand.tinifyImage(folder);
	});

};

export async function activate(context: vscode.ExtensionContext) {
	
	// 监听配置修改
	watcher = onConfChange(subscripe);

	// fixBug 必须在activate注册,否则首次使用命令不会生效
	await tinifyCommand.validate();
	tinifyImagesDisposable = vscode.commands.registerCommand('tinify-helper.tinifyImages', (folder) => {
		tinifyCommand.tinifyImages(folder);
	});
	tinifyImageDisposable = vscode.commands.registerCommand('tinify-helper.tinifyImage', (folder) => {
		tinifyCommand.tinifyImage(folder);
	});

}

// this method is called when your extension is deactivated
export function deactivate() {
	watcher?.dispose();
	tinifyImagesDisposable?.dispose();
	tinifyImageDisposable?.dispose();
}
