/**
 * Fetch origin master branch and merge into current branch
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import { getGitRepository } from "./util";

export default () => vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Sync From Master'
}, syncFromMaster);

/**
 * 
 * @param targetRepositoryName targetRepository should be in same folder of current repository
 */
async function syncFromMaster(progress: vscode.Progress<{ message?: string; increment?: number }>) {
    try {
        const repository = await getGitRepository();
        const branchName = repository.state.HEAD?.name;
        if (!branchName) { throw new Error('Failed to get current branch name'); };
        const defaultBranchName = 'master'; // NOTE default branch may not be master, fix later
        await repository.checkout(defaultBranchName);
        progress.report({ message: `Checkout ${defaultBranchName} success` });
        await repository.fetch();
        await repository.pull();
        await new Promise<void>(resolve => setTimeout(resolve, 2000)); // NOTE vscode resolve when pull is not finished
        progress.report({ message: `Pull ${defaultBranchName} success` });
        await repository.checkout(branchName);
        try {
            await (repository as any)?.repository?.merge(defaultBranchName);
        } catch (e: any) {
            console.error(e);
            throw new Error(`Merge ${defaultBranchName}: ${e.message}(${e.gitArgs?.join(' ')}) \n ${e.stderr}`);
        }
        progress.report({ message: `Merge ${defaultBranchName} success` });
        repository.push();
        progress.report({ message: `Push ${branchName} success` });
    } catch (e: any) {
        console.error(e);
        vscode.window.showErrorMessage(e.message);
    }
}

export function remote2RepositoryPrefix(remote: string) {
    return remote.replace(/.+\/\/[^\/]+\/(.+)\.git/, '$1');
}
