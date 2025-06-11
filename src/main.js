const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const mime = require('mime-types');

const isMac = process.platform === 'darwin';

function createMainWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 1080,
    height: 600,
    // minWidth: 600,
    // minHeight: 400,
    useContentSize: true,
    backgroundColor: '#151515', // temp
    title: 'Project Designer',
    icon: path.join(__dirname, 'assets/icons/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('src/index.html');

  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  const menu = Menu.buildFromTemplate([
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    {
      label: 'Developer',
      submenu: [
        { label: 'Developer Tools', role: 'toggleDevTools' },
        {
          label: 'Developer Tools (Detached)',
          click: () => {
            if (win) {
              if (win.webContents.isDevToolsOpened())
                win.webContents.closeDevTools();
              else
                win.webContents.openDevTools({ mode: 'detach' });
            }
          }
        },
        {
          label: 'Screenshot',
          accelerator: 'f2',
          click: () => {
            const screenshotsFolder = path.join(__dirname, '..', 'screenshots');

            if (!fs.existsSync(screenshotsFolder))
              fs.mkdirSync(screenshotsFolder, { recursive: true });

            // get list of existing screenshots matching "screenshot_N.png"
            const files = fs.readdirSync(screenshotsFolder);
            const screenshotNumbers = files
              .map(file => {
                const match = file.match(/^screenshot_(\d+)\.png$/);
                return match ? parseInt(match[1], 10) : null;
              })
              .filter(num => num !== null);

            // get next available number
            const nextNumber = (screenshotNumbers.length ? Math.max(...screenshotNumbers) : 0) + 1;
            const screenshotPath = path.join(screenshotsFolder, `screenshot_${nextNumber}.png`);

            // ave screenshot
            win.webContents.capturePage().then((image) => {
              fs.writeFile(screenshotPath, image.toPNG(), (err) => {
                if (err) {
                  console.error('failed to save screenshot:', err);
                } else {
                  console.log(`screenshot saved: screenshot_${nextNumber}.png`);
                }
              });
            });
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);

  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Developer Tools', role: 'toggleDevTools' }
  // ]);

  // win.webContents.on('context-menu', (e, props) => {
  //   contextMenu.popup(win);
  // });
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

async function readProject(dirPath) {
  const items = await fsPromises.readdir(dirPath, { withFileTypes: true });

  const children = await Promise.all(items.map(async (item) => {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      return await readProject(fullPath);
    } else {
      return {
        label: item.name,
        type: 'file',
        children: [],
      };
    }
  }));

  return {
    label: path.basename(dirPath),
    type: 'folder',
    children,
  };
}

ipcMain.handle('read-project', async (event, dirPath) => {
  return await readProject(dirPath);;
});

ipcMain.handle('get-mime-type', (event, filename) => {
  return mime.lookup(filename);
});
