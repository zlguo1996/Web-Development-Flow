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
                    const urlRegex = /(https?:\/\/)*[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                    const range = document.getWordRangeAtPosition(position, urlRegex);
                    if (range) {
                        const url = document.getText(range);
                        const imageSuffixRegex = /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff|tif|jfif|ppm|pgm|pbm|pnm|ppm|xbm|xbm|xpm|xwd|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d)$/i;
                        const isImage = imageSuffixRegex.test(url);
                        if (isImage) {
                            const markdownString = new vscode.MarkdownString(`![image](${url})`);
                            return new vscode.Hover(markdownString);
                        }
                    }
                }
            }
        )
    );
}