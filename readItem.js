const { BrowserWindow } = require("electron");

//  Offscreen Browser window
let offscreenWindow;

// Export readItem function
module.exports = (url, callback) => {
  // Create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });
  console.log(url);

  // Load Item url
  offscreenWindow.loadURL(url);

  // Wait for content to finish loading
  offscreenWindow.webContents.on("did-finish-load", (e) => {
    // Get page title
    let title = offscreenWindow.getTitle();

    //   Get screenshot
    offscreenWindow.webContents.capturePage().then((image) => {
      // Get image as dataUrl
      let screenshot = image.toDataURL();

      // Execute callback with new item object
      callback({ title, screenshot, url });

      // Clean up
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
