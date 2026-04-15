const { contextBridge, ipcRenderer } = require('electron');

// 为渲染进程提供安全的API访问
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件操作
  selectFiles: () => ipcRenderer.invoke('select-files'),
  saveFile: (fileName, fileContent) => ipcRenderer.invoke('save-file', { fileName, fileContent }),
  
  // 处理状态更新
  updateProcessingStatus: (status) => ipcRenderer.send('update-processing-status', status),
  
  // UI交互
  onFileUploadTrigger: (callback) => ipcRenderer.on('trigger-file-upload', callback),
  onToggleProcessingOptions: (callback) => ipcRenderer.on('toggle-processing-options', callback),
  onShowUsageGuide: (callback) => ipcRenderer.on('show-usage-guide', callback),
  
  // 清理事件监听器
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('trigger-file-upload');
    ipcRenderer.removeAllListeners('toggle-processing-options');
    ipcRenderer.removeAllListeners('show-usage-guide');
  }
});