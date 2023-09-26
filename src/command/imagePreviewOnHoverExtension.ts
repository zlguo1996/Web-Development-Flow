/**
 * 当鼠标光标移动到编辑器的图片链接上时，显示图片预览
 */

import * as vscode from 'vscode';
import { documentSelectorJavascriptFamily } from './util';

export default function activateImagePreviewOnHoverExtension(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            documentSelectorJavascriptFamily,
            {
                provideHover(document, position, token) {
                    const range = document.getWordRangeAtPosition(position, /!\[.*\]\((.*)\)/);
                    if (range) {
                        const text = document.getText(range);
                        const imageUrl = text.match(/!\[.*\]\((.*)\)/)?.[1];
                        if (imageUrl) {
                            const markdownString = new vscode.MarkdownString(`![image](${imageUrl})`);
                            return new vscode.Hover(markdownString);
                        }
                    }
                }
            }
        )
    );
}