const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');

const isMac = process.platform === 'darwin';

function createMainWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    backgroundColor: '#151515',
    title: 'Project Designer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'DevTools',
      click: () => win.webContents.openDevTools()
    }
  ]);

  win.webContents.on('context-menu', (e, props) => {
    contextMenu.popup(win);
  });

  win.loadFile('index.html');
}

app.on('ready', () => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (!isMac)
    app.quit();
});
