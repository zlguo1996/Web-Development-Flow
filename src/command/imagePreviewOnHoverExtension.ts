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
                        const imageUrl = document.getText(range);
                        const imageSuffixRegex = /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff|tif|jfif|ppm|pgm|pbm|pnm|ppm|xbm|xbm|xpm|xwd|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d|x3f|x3m|x3a|x3e|x3g|x3b|x3d)$/i;
                        const isImage = imageSuffixRegex.test(imageUrl);
                        if (isImage) {
                            const markdownString = new vscode.MarkdownString(`![image](${imageUrl})`);
                            return new vscode.Hover(markdownString);

                            // const markdownString = new vscode.MarkdownString();
                            // markdownString.appendMarkdown(`<div class="image-container"><img src="${imageUrl}"></div>`);
                            // markdownString.appendMarkdown(`<style>.image-container{max-width:100%;max-height:100%;overflow:auto;}.image-container img{max-width:100%;max-height:100%;object-fit:contain;}</style>`);
                            // return new vscode.Hover(markdownString);
                        }
                    }
                }
            }
        )
    );
}