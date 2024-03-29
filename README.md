# Web Development Flow

让 Web 开发更为流畅的 VS Code 插件，目标是提高其他工具与 VS Code 间的协同效率。如：将选中代码复制为gitlab链接用于分享、用typora打开markdown文件等。

## Features

1. 跨工程分支合并：合并某工程（A）的分支到另外一个工程（B）的同名分支下（其中 B fork 自 A）。在 VSCode 的指令窗口输入 `Merge Branch Into Fork Repository` 即可将当前工程的分支合入同文件夹下的其他工程分支。需要注意出现权限提示时要赋予，否则无法正常在 VSCode Source Control 打开其他文件的 git。当出现代码冲突时，请在 Source Control 自行解决。
2. 复制代码为链接：选中指定文件的特定行或多行，右键点击 `Copy As Link`，即可复制其在远程git仓库的链接。支持Github、Gitlab、私有化Gitlab。
3. 海豚主题支持：输入 `theme.`，即可获得所有主题token的代码提示，数据实时和海豚文档的token同步。
4. 使用typora打开md文件：在打开md文件后，在上方tab右键使用 `Open With Typora` 即可使用本地的 typora app 打开md文件进行编辑。（前置要求：本地安装了 Typora）
5. 图片自动上传：将图片文件拖拽到 `js` / `ts` 文件中，会自动使用系统中的 PicGo 服务上传图片，并格式化成 js 对象。（前置要求：本地安装了 PicGo）

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
