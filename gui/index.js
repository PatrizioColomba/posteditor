class PEPorts {

    #fp = require('find-free-port');
    #guiPort = null;
    #restPort = null;

    guiPort(callback) {
        this.#fp(8080, (err, freePort) => {
            if (freePort) {
                this.#guiPort = freePort;
                console.log("[GUI port] " + this.#guiPort);
                callback(freePort);
            } else {
                console.log("[GUI port] Error: " + err);
                throw "[GUI port] Error: " + err;
            }
        });
    }

    restPort(callback) {
        this.#fp(4000, (err, freePort) => {
            if (freePort) {
                this.#restPort = freePort;
                console.log("[REST port] " + this.#restPort);
                callback(freePort);
            } else {
                console.log("[REST port] Error: " + err);
                throw "[REST port] Error: " + err;
            }
        });
    }

    getGUIPort() {
        if (this.#guiPort) {
            return this.#guiPort;
        } else {
            throw "GUI port not setted";
        }
    }
    
    getRESTPort() {
        if (this.#restPort) {
            return this.#restPort;
        } else {
            throw "REST port not setted";
        }
    }
}

class HttpServer {
    #root = null;

    constructor(root) {
        this.#root = root;
    }

    startOn(host, port) {
        var express = require('express');
        this.app = express();
        this.app.use(express.static(this.#root));
        this.app.listen(port);

        return host + ":" + port;
    }
}

const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');
const targetPath = "../service/target";
const jar = "spring-0.0.1-SNAPSHOT.jar";
let restService = null;
let pePorts = new PEPorts();
let httpServer = new HttpServer(__dirname + '/build');

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    });

    pePorts.guiPort(function() {
        const url = httpServer.startOn(
            "http://localhost", 
            pePorts.getGUIPort()
            )

        mainWindow.loadURL(url);
    });
    pePorts.restPort(function (freePort) {
        restService = spawn('java', ['-jar', targetPath+"/"+jar, "--server.port="+freePort]);
        restService.on('data', function() {
            console.log('Spring service is ready!');
        });
    });

    mainWindow.on('closed', function() {
        restService.kill('SIGHUP');
    });
});
