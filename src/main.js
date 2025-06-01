const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');
const fs = require('fs');

const isMac = process.platform === 'darwin';

function createMainWindow() {
  const win = new BrowserWindow({
    show: false,
    width: 1080,
    height: 600,
    useContentSize: true,
    backgroundColor: '#151515', // temp
    title: 'Project Designer',
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

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Developer Tools', role: 'toggleDevTools' }
  ]);

  Menu.setApplicationMenu(menu);

  win.webContents.on('context-menu', (e, props) => {
    contextMenu.popup(win);
  });
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
