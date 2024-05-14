// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as fs from 'fs-extra'
import * as path from 'path'

const getPath = (str: string) => path.resolve(__dirname, str)

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const optionMap: { [key: string]: string } = {
  批量操作: 'batch',
  '新增&编辑': 'edit',
  详情: 'detail',
  删除: 'delete',
  导出: 'export'
}
const allFeatures = Object.values(optionMap)
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('createTemplate.create', async (uri: vscode.Uri) => {
    try {
      // 1.输入组件名称
      const folderName = await vscode.window.showInputBox({ prompt: '请输入页面组件名称' })
      if (!folderName) {
        return vscode.window.showErrorMessage('请输入页面名称')
      }

      // 2. 选择功能allF
      const selectedFeatures = await vscode.window.showQuickPick(Object.keys(optionMap), {
        placeHolder: '请选择包含功能',
        canPickMany: true
      })

      const features = selectedFeatures?.map((v) => optionMap[v]) || []

      // 3.创建新的文件夹路径，并确保路径存在
      const templatePath = getPath(`./templates`)
      const targetPath = uri.fsPath + '/' + folderName
      await updateFiles(templatePath, targetPath, features)

      // 4. 修改index.tsx入口组件名
      const indexPath = path.join(targetPath, 'index.tsx')
      const indexContent = fs.readFileSync(indexPath, 'utf-8')
      const newContent = indexContent.replace(
        'export default function Template',
        `export default function ${folderName}`
      )
      fs.writeFileSync(indexPath, newContent)

      // 5. 修改路由文件

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

async function updateFiles(originalDir: string, outputDir: string, features: string[]) {
  const files = await fs.readdir(originalDir)

  // 遍历所有文件
  for (const file of files) {
    const filePath = path.join(originalDir, file)

    let stats = await fs.lstat(filePath)

    if (stats.isDirectory()) {
      // 递归处理
      await updateFiles(filePath, path.join(outputDir, file), features)
      // 只处理 .tsx, .ts文件
    } else if (['.tsx', '.ts'].includes(path.extname(file))) {
      // 如果没有detail功能呢，那么文件名称 detail 相关的 都不用复制处理
      let notNeedCopy = allFeatures.some((feature) => {
        if (file.toLowerCase().includes(feature.toLowerCase()) && !features.includes(file.toLowerCase())) {
          return true
        }
        return false
      })

      if (notNeedCopy) {
        continue
      }

      const data = await fs.readFile(filePath, 'utf8')

      // 根据所需要的功能替换内容
      const newData = extractComments(data, features)
      // 重写文件
      // 新的输出文件路径
      let outputFilePath = path.join(outputDir, file)
      // 确保目录存在
      await fs.ensureDir(path.dirname(outputFilePath))
      // 写入新的文件
      await fs.writeFile(outputFilePath, newData, 'utf8')
      console.log(`File ${filePath} updated.`)
    }
  }
}

function extractComments(text: string, keepArray: string[]) {
  allFeatures.forEach((pattern) => {
    if (!keepArray.includes(pattern)) {
      const removePattern = new RegExp(
        `\\{?\\/\\* start_${pattern} \\*\\/\\}?[\\s\\S]*?\\{?\\/\\* end_${pattern} \\*\\/\\}?`,
        'g'
      )
      text = text.replace(removePattern, '')
    } else {
      let keepPatternStart = new RegExp('{?/\\* start_' + pattern + ' \\*/}?', 'g')
      let keepPatternEnd = new RegExp('{?/\\* end_' + pattern + ' \\*/}?', 'g')
      text = text.replace(keepPatternStart, '')
      text = text.replace(keepPatternEnd, '')
    }
  })

  return text.replace(/^\s*[\r\n]/gm, '')
}
