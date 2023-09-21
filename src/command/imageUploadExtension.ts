/**
 * 图片自动上传插件
 * 利用系统安装的picgo服务自动上传
 */

import * as path from 'path';
import * as vscode from 'vscode';
import axios from 'axios';

const uriListMime = 'text/uri-list';

function isImage(extname: string) {
    const imageExtname = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtname.includes(extname);
}

/**
 * Provider that inserts a numbered list of the names of dropped files.
 * 
 * Try dropping one or more files from:
 * 
 * - VS Code's explorer
 * - The operating system
 * - The open editors view 
 */
class UploadImageOnDropProvider implements vscode.DocumentDropEditProvider {
    async provideDocumentDropEdits(
        _document: vscode.TextDocument,
        _position: vscode.Position,
        dataTransfer: vscode.DataTransfer,
        token: vscode.CancellationToken
    ): Promise<vscode.DocumentDropEdit | undefined> {
        // Check the data transfer to see if we have dropped a list of uris
        const dataTransferItem = dataTransfer.get(uriListMime);
        if (!dataTransferItem) {
            return undefined;
        }

        // 'text/uri-list' contains a list of uris separated by new lines.
        // Parse this to an array of uris.
        const urlList = await dataTransferItem.asString();
        if (token.isCancellationRequested) {
            return undefined;
        }

        const uris: vscode.Uri[] = [];
        for (const resource of urlList.split('\n')) {
            try {
                uris.push(vscode.Uri.parse(resource.replace(/[\n\t\r]/g, "").trim()));
            } catch {
                // noop
            }
        }

        if (!uris.length) {
            return undefined;
        }

        const imageUris = uris.filter(uri => {
            const extname = path.extname(uri.path);
            return isImage(extname);
        }).map(
            uri => uri.path
        );

        /**
         * Upload image
         * https://picgo.github.io/PicGo-Doc/en/guide/advance.html#picgo-server-usage
         */
        try {
            const uploadRes = await axios.post('http://localhost:36677/upload', {
                list: imageUris,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data: {
                success: true;
                result: string[];
            } | {
                success: false;
                result: string | undefined;
            } = uploadRes.data || {
                success: false,
                result: undefined,
            };
            const { success, result } = data;
            if (!success) {
                vscode.window.showErrorMessage(
                    result || `上传图片失败，请确保picgo服务已启动`
                );
                return undefined;
            }
            const urls = result;

            // Build a snippet to insert
            const snippet = new vscode.SnippetString();
            urls.forEach((url, index) => {
                snippet.appendText(url);
                snippet.appendTabstop();

                if (index <= urls.length - 1 && urls.length > 1) {
                    snippet.appendText('\n');
                }
            });

            return new vscode.DocumentDropEdit(snippet);
        } catch (error) {
            vscode.window.showErrorMessage(
                `上传图片失败，请确保picgo服务已启动`
            );
        }

        return undefined;
    }
}


export default function activateImageUploadExtension(context: vscode.ExtensionContext) {
    const selector: vscode.DocumentSelector = [
        'javascript',
        'javascriptreact',
        'typescript',
        'typescriptreact'
    ];
    /**
     * demo
     * https://github.com/microsoft/vscode-extension-samples/blob/main/drop-on-document/src/extension.ts
     */
    context.subscriptions.push(
        vscode.languages.registerDocumentDropEditProvider(
            selector, new UploadImageOnDropProvider(),
        )
    );
}