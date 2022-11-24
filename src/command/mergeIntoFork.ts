/**
 * merge current branch to forked repository of same branch name
 */
import * as vscode from 'vscode';
import { GitErrorCodes } from './git';
import { getGitRepository } from "./util";

export function remote2RepositoryPrefix(remote: string) {
    return remote.replace(/.+\/\/[^\/]+\/(.+)\.git/, '$1');
}

/**
 * 
 * @param targetRepositoryName targetRepository should be in same folder of current repository
 */
export default async function mergeIntoFork() {
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

    const remoteFetchUrl = repositorySource.state.remotes?.[0]?.fetchUrl;
    if (!remoteFetchUrl) { throw new Error('Failed to get remote fetch url of current repository'); };

    const targetBranchPrefix = remote2RepositoryPrefix(remoteFetchUrl);

    await repositoryTarget.fetch({
        remote: remoteFetchUrl,
        ref: `${branchName}:${targetBranchPrefix}/${branchName}`
    });
    console.log('repositoryTarget: fetch remote success');

    try {
        const branch = await repositoryTarget.getBranch(branchName);
        if (repositoryTarget.state.HEAD?.commit !== branch.commit) {
            await repositoryTarget.checkout(branchName);
        }
    } catch {
        await repositoryTarget.createBranch(branchName, true);
    }
    console.log(`repositoryTarget: checkout ${branchName} success`);

    try {
        await (repositoryTarget as any)?.repository?.merge(`${targetBranchPrefix}/${branchName}`);
    } catch (e: any) {
        throw new Error(`repositoryTarget: ${e.message}(${e.gitArgs?.join(' ')}) \n ${e.stderr}`);
    }
    console.log(`repositoryTarget: merge ${targetBranchPrefix}/${branchName} success`);

    try {
        await repositoryTarget.push('origin', branchName, true);
    } catch (e: any) {
        throw new Error(`repositoryTarget: ${e.message}(${e.gitArgs?.join(' ')}) \n ${e.stderr}`);
    }
    console.log(`repositoryTarget: push ${branchName} success`);
}