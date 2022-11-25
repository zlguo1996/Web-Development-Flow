/**
 * Merge current branch to fork repository of same branch name
 * 
 * Use Case: 
 *  When repository grows, we would split repository to multiple repositories by fork. 
 *      Thus: 
 *      1. every fork could contain custom config files for independent deployment.
 *      2. every fork could update their dependencies independently.
 *  However, since multiple forks may reference to same file. We want to develop in the original repository.
 * 
 * Implementation:
 *  This command first ask for the target fork repository path, which must exists in local disk.
 *  Then we merge the branch of current (original) repository to the branch of same name in fork repository.
 */
import * as vscode from 'vscode';
import { getGitRepository } from "./util";

export default () => vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Merge Into Fork'
}, mergeIntoFork);

/**
 * 
 * @param targetRepositoryName targetRepository should be in same folder of current repository
 */
async function mergeIntoFork(progress: vscode.Progress<{ message?: string; increment?: number }>) {
    try {
        const targetRepositoryName = await vscode.window.showInputBox({ // TODO dropdown
            placeHolder: "Target Repository Name",
            prompt: "Merge",
            value: ''
        });
        const [repositoryTarget, repositorySource] = await Promise.all([getGitRepository(targetRepositoryName), getGitRepository()]);
        const branchName = repositorySource.state.HEAD?.name;
        if (!branchName) { throw new Error('Failed to get branch name of current repository'); };

        try {
            await repositorySource.push('origin', branchName, true);
        } catch (e: any) {
            throw new Error(`repositorySource: ${e.message}(${e.gitArgs?.join(' ')}) \n ${e.stderr}`);
        }
        progress.report({ message: 'repositorySource: push remote success' });

        const remoteFetchUrl = repositorySource.state.remotes?.[0]?.fetchUrl;
        if (!remoteFetchUrl) { throw new Error('Failed to get remote fetch url of current repository'); };

        const targetBranchPrefix = remote2RepositoryPrefix(remoteFetchUrl);

        await repositoryTarget.fetch({
            remote: remoteFetchUrl,
            ref: `${branchName}:${targetBranchPrefix}/${branchName}`
        });
        progress.report({ message: 'repositoryTarget: fetch remote success' });

        try {
            const branch = await repositoryTarget.getBranch(branchName);
            if (repositoryTarget.state.HEAD?.commit !== branch.commit) {
                await repositoryTarget.checkout(branchName);
            }
        } catch {
            await repositoryTarget.createBranch(branchName, true);
        }
        progress.report({ message: `repositoryTarget: checkout ${branchName} success` });

        try {
            await (repositoryTarget as any)?.repository?.merge(`${targetBranchPrefix}/${branchName}`);
        } catch (e: any) {
            throw new Error(`repositoryTarget: ${e.message}(${e.gitArgs?.join(' ')}) \n ${e.stderr}`);
        }
        progress.report({ message: `repositoryTarget: merge ${targetBranchPrefix}/${branchName} success` });

        try {
            await repositoryTarget.push('origin', branchName, true);
        } catch (e: any) {
            throw new Error(`repositoryTarget: ${e.message}(${e.gitArgs?.join(' ')}) \n ${e.stderr}`);
        }
        progress.report({ message: `repositoryTarget: push ${branchName} success` });
    } catch (e: any) {
        vscode.window.showErrorMessage(e.message);
    }
}

export function remote2RepositoryPrefix(remote: string) {
    return remote.replace(/.+\/\/[^\/]+\/(.+)\.git/, '$1');
}

