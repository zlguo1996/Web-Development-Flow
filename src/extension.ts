// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from "child_process";
import copyAsLink from './command/copyAsLink';
import mergeIntoFork from './command/mergeIntoFork';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand('web-development-flow.helloWorld', () => {
			vscode.window.showWarningMessage('Hello World from web-development-flow!');
		}),
		vscode.commands.registerCommand('web-development-flow.copyAsLink', copyAsLink),
		vscode.commands.registerCommand('web-development-flow.openWithTypora', (uri) => {
			if (uri) { // 通过context menu进入
				cp.exec(`open -a typora ${uri}`);
				return;
			}

			const activeTextEditor = vscode.window.activeTextEditor;
			if (activeTextEditor) {
				cp.exec(`open -a typora ${activeTextEditor.document.fileName}`);
			}
		}),
		vscode.commands.registerCommand('web-development-flow.mergeIntoFork', mergeIntoFork)
	];

	disposables.forEach((disposable) => {
		context.subscriptions.push(disposable);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
