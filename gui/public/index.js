const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');
const fp = require('find-free-port');
const targetPath = "../service/target";
const jar = "spring-0.0.1-SNAPSHOT.jar";
let springService = null;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    })

    mainWindow.loadURL("http://localhost:3000");

    mainWindow.on('closed', function() {
        springService.kill('SIGHUP');
        console.log("Bye!");
    });
}

app.whenReady().then(() => {
    fp(8080, function(err, freePort) {
        if(freePort) {
            console.log("I'm port " + freePort + " and i'm free!");
            springService = spawn('java', ['-jar', targetPath+"/"+jar, "--server.port="+freePort]);
            springService.on('data', function() {
                console.log('Spring service is ready!');
            });
            createWindow();
        } else {
            alert(err);
        }
    });
});