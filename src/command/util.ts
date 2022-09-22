import * as vscode from 'vscode';
import { GitExtension } from './git';

export function getGitRepository() {
    const gitAPI = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports?.getAPI(1);
    if (!gitAPI) { throw new Error('Extension vscode.git should be enabled'); };
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri;
    if (!rootPath) { throw new Error('rootPath not exists'); };
    const repository = gitAPI.getRepository(rootPath);
    if (!repository) { throw new Error(`repository not exists for path - ${rootPath}`); };
    return repository;
}