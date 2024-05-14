// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import * as path from 'path'

const getPath = (str: string) => path.resolve(__dirname, str)

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const optionMap: { [key: string]: string } = {
  简单模版: 'simpleTemplate',
  完整模版: 'fullyTemplate',
  Tab模版: 'multipleTabTemplate'
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('createTemplate.create', async (uri: vscode.Uri) => {
    try {
      // 1. 选择文件模版
      const selectedTemplate = await vscode.window.showQuickPick(Object.keys(optionMap), {
        placeHolder: '请选择模版类型'
      })

      // 2.输入组件名称
      const folderName = await vscode.window.showInputBox({ prompt: '请输入页面组件名称' })
      // 创建新的文件夹路径，并确保路径存在
      const templatePath = getPath(`./templates/${optionMap[selectedTemplate!]}`)
      const targetPath = uri.fsPath + '/' + (folderName || selectedTemplate)
      // 3. 复制模版
      await fs.copy(templatePath, targetPath)
      // 4. 修改index.tsx入口组件名
      const indexPath = path.join(targetPath, 'index.tsx')
      const indexContent = fs.readFileSync(indexPath, 'utf-8')
      const newContent = indexContent.replace(
        'export default function Template',
        `export default function ${folderName}`
      )
      fs.writeFileSync(indexPath, newContent)

      vscode.window.showInformationMessage('创建页面成功!')
    } catch (error) {
      vscode.window.showErrorMessage('error')
      console.error(error)
    }
  })

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
