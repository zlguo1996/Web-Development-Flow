import * as vscode from 'vscode';
import { GitExtension } from './git';

/**
 * 
 * @param repositoryName If exists, get repository of repositoryName inside same folder of root
 * @returns 
 */
export async function getGitRepository(repositoryName?: string) {
    const gitAPI = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports?.getAPI(1);
    if (!gitAPI) { throw new Error('Extension vscode.git should be enabled'); };
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!rootPath) { throw new Error('rootPath not exists'); };
    let repositoryUri = rootPath;
    if (repositoryName) {
        repositoryUri = vscode.Uri.joinPath(rootPath, '..', repositoryName);
    }
    const repository = await gitAPI.openRepository(repositoryUri);
    if (!repository) { throw new Error(`repository not exists for path - ${repositoryUri.path} ${rootPath.path}`); };
    return repository;
}

/**
 * 语言选择器
 * Javascript家族
 */
export const documentSelectorJavascriptFamily: vscode.DocumentSelector = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
];