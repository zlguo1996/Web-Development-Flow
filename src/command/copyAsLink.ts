/**
 * Copy selected lines as http link of Gitlab / Github for share
 */

import * as vscode from 'vscode';
import { getGitRepository } from './util';

export function remote2Url(remote: string) {
    if (/^http(s)?:\/\//.test(remote)) {
        return remote.replace(/\.git$/, '');
    }

    if (/^(ssh:\/\/)?git@/.test(remote)) {
        return remote.replace(/^(ssh:\/\/)?git@([^:]+):([\d]+\/)?([^.]+)\.git$/, 'https://$2/$4');
    }

    return remote;

}

export default async function copyAsLink() {
    const repository = await getGitRepository();
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        const start = activeTextEditor.selections?.[0]?.start?.line;
        const end = activeTextEditor.selections?.[0]?.end?.line;

        const info = {
            line: start === end ? `${start + 1}` : `${start + 1}-${end + 1}`,
            path: vscode.workspace.asRelativePath(activeTextEditor.document.fileName),
            commit: repository.state.HEAD?.commit,
            url: remote2Url(repository.state.remotes?.[0]?.fetchUrl || '')
        };

        const url = `${info.url}/blob/${info.commit}/${info.path}#L${info.line}`;

        vscode.env.clipboard.writeText(url);
    }
}