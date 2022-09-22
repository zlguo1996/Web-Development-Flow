// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from "child_process";
import { GitExtension } from './git';

function getGitRepository() {
	const gitAPI = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports?.getAPI(1);
	if (!gitAPI) { throw new Error('Extension vscode.git should be enabled'); };
	const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri;
	if (!rootPath) { throw new Error('rootPath not exists'); };
	const repository = gitAPI.getRepository(rootPath);
	if (!repository) { throw new Error(`repository not exists for path - ${rootPath}`); };
	return repository;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand('web-development-flow.helloWorld', () => {
			vscode.window.showWarningMessage('Hello World from web-development-flow!');
		}),
		vscode.commands.registerCommand('web-development-flow.copyAsLink', () => {
			const repository = getGitRepository();
			const activeTextEditor = vscode.window.activeTextEditor;
			if (activeTextEditor) {
				const start = activeTextEditor.selections?.[0]?.start?.line;
				const end = activeTextEditor.selections?.[0]?.end?.line;
				const info = {
					line: start === end ? `${start + 1}` : `${start + 1}-${end + 1}`,
					path: vscode.workspace.asRelativePath(activeTextEditor.document.fileName),
					commit: repository.state.HEAD?.commit,
					remote: repository.state.remotes?.[0]?.fetchUrl
				};

				const url = `${info.remote?.replace(/\.git$/, '/-/blob/')}${info.commit}/${info.path}#L${info.line}`;

				vscode.env.clipboard.writeText(url);
			}
		}),
		vscode.commands.registerCommand('web-development-flow.openWithTypora', () => {
			const activeTextEditor = vscode.window.activeTextEditor;
			if (activeTextEditor) {
				cp.exec(`open -a typora ${activeTextEditor.document.fileName}`);
			}
		})
	];

	disposables.forEach((disposable) => {
		context.subscriptions.push(disposable);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
