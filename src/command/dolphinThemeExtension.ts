/**
 * 海豚主题代码提示
 */

import * as vscode from 'vscode';
import axios from 'axios';

export default function activateDolphinThemeExtension(context: vscode.ExtensionContext) {
  const themeProvider = axios({
    method: 'get',
    url: 'https://haitun.netease.com/api/haitun/theme/get?id=12'
  }).then((res: any) => res.data).then(
    (res: any) => {
      return res.data;
    }
  );

  const provideCompletionItems: vscode.CompletionItemProvider['provideCompletionItems'] = (
    document, position, token
  ) => {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith('theme.')) {
      return undefined;
    }

    return themeProvider.then((res: any) => {
      const { tokens } = res;
      const items = tokens.map((token: any) => {
        const item = new vscode.CompletionItem(`${token.name} \t ${token.value}`, vscode.CompletionItemKind.Variable);
        item.insertText = token.name;
        item.detail = token.groupAlias;
        item.documentation = token.scenes.map((scene: any) => {
          const { alias, value } = scene;
          return `${alias}: ${value}`;
        }).join('\n');
        return item;
      });
      return items;
    });
  };

  context.subscriptions.push(vscode.languages.registerCompletionItemProvider([
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact'
  ], {
    provideCompletionItems
  }, '.'));

}