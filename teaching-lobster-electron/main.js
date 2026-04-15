const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

// 初始化存储
const store = new Store();

// 保持对窗口对象的全局引用，如果不这样做，当JavaScript对象被垃圾回收时，窗口将自动关闭
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: '教学龙虾 - 自动文档处理助手',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  // 加载应用的index.html
  mainWindow.loadFile('index.html');

  // 打开开发工具（可选）
  // mainWindow.webContents.openDevTools();

  // 当窗口关闭时触发
  mainWindow.on('closed', function () {
    // 取消引用窗口对象，如果应用支持多窗口，通常会将窗口存储在数组中
    mainWindow = null;
  });

  // 设置应用菜单
  setupMenu();
}

// 设置应用菜单
function setupMenu() {
  const { Menu } = require('electron');
  
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '上传文件',
          accelerator: 'CmdOrCtrl+U',
          click() {
            mainWindow.webContents.send('trigger-file-upload');
          }
        },
        {
          label: '处理选项',
          accelerator: 'CmdOrCtrl+O',
          click() {
            mainWindow.webContents.send('toggle-processing-options');
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click() {
            mainWindow.reload();
          }
        },
        {
          label: '切换全屏',
          accelerator: 'F11',
          click() {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        {
          label: '开发者工具',
          accelerator: 'CmdOrCtrl+Shift+I',
          click() {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '使用指南',
          click() {
            mainWindow.webContents.send('show-usage-guide');
          }
        },
        {
          label: '关于',
          click() {
            dialog.showMessageBox({
              title: '关于教学龙虾',
              message: '教学龙虾 - 自动文档处理助手\n\n版本: 1.0.0\n\n专为教师设计的智能文档处理工具，帮助教师从繁重的文件处理工作中解脱出来。',
              buttons: ['确定'],
              icon: path.join(__dirname, 'assets', 'icon.png')
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 处理文件选择对话框
ipcMain.on('select-files', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '所有支持的文件', extensions: ['docx', 'xlsx', 'pptx', 'pdf', 'txt'] },
      { name: 'Word 文档', extensions: ['docx', 'doc'] },
      { name: 'Excel 表格', extensions: ['xlsx', 'xls'] },
      { name: 'PowerPoint 演示文稿', extensions: ['pptx', 'ppt'] },
      { name: 'PDF 文档', extensions: ['pdf'] },
      { name: '文本文件', extensions: ['txt'] }
    ]
  });

  if (!canceled && filePaths.length > 0) {
    // 读取文件并发送给渲染进程
    const files = filePaths.map(filePath => {
      const stats = fs.statSync(filePath);
      return {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        type: getFileType(filePath)
      };
    });
    
    event.reply('selected-files', files);
  }
});

// 获取文件类型
function getFileType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case '.docx':
    case '.doc':
      return 'application/msword';
    case '.xlsx':
    case '.xls':
      return 'application/vnd.ms-excel';
    case '.pptx':
    case '.ppt':
      return 'application/vnd.ms-powerpoint';
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}

// 处理文件保存对话框
ipcMain.on('save-file', async (event, { fileName, fileContent }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: fileName
  });

  if (!canceled && filePath) {
    try {
      fs.writeFileSync(filePath, fileContent);
      event.reply('file-saved', { success: true, path: filePath });
    } catch (error) {
      event.reply('file-saved', { success: false, error: error.message });
    }
  }
});

// 处理文件处理进度更新
ipcMain.on('update-processing-status', (event, status) => {
  // 可以在这里添加进度通知或系统托盘更新
  console.log('Processing status:', status);
});

// 应用准备就绪后创建窗口
app.on('ready', createWindow);

// 当所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  // 在macOS上，应用程序及其菜单栏通常保持活动状态，直到用户明确退出Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在macOS上，当点击dock图标并没有其他窗口打开时，重新创建一个窗口
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});