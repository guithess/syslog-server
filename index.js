"use strict";

const dgram = require("dgram");
const EventEmitter = require("events");

class SyslogServer extends EventEmitter {

    constructor() {
        super();
        this.server = null;
    }

    start(options = { port: 514, address: "0.0.0.0", exclusive: true }, cb) {
        return new Promise((resolve, reject) => {
            if (this.server.listening === true) {
                let errorObj = createErrorObject(null, "NodeJS Syslog Server is already running!");
                if (cb) return cb(errorObj, this);
                return reject(errorObj);
            } else {
                this.server = dgram.createSocket("udp4");

                // Socket listening handler
                this.server.on("listening", () => {
                    this.emit("start", this);
                });

                // Socket error handler
                this.server.on("error", (err) => {
                    this.emit("error", err);
                });

                // Socket message handler
                this.server.on("message", (msg, remote) => {
                    let message = {
						date: new Date(),
                        host: remote.address,
                        message: msg.toString("utf8"),
						protocol: remote.family
                    };
                    this.emit("message", message);
                });

                // Socket close handler
                this.server.on("close", () => {
                    this.emit("stop");
                });

                this.server.bind(options, (err) => {
                    if (err) {
                        let errorObj = createErrorObject(err, "NodeJS Syslog Server failed to start!");
                        if (cb) return cb(errorObj, this);
                        return reject(errorObj);
                    } else {
                        if(cb) return cb(null, this);
                        return resolve(this);
                    }
                });
            }
        });
    }

    stop(cb) {
        return new Promise((resolve, reject) => {
            try {
                this.server.close(() => {
                    if (cb) return cb(null, this);
                    return resolve(this);
                });
            } catch (err) {
                let errorObj = createErrorObject(err, "NodeJS Syslog Server is not running!");
                if (cb) return cb(errorObj, this);
                return reject(errorObj);
            }
        });
    }

    isRunning() {
        return (this.server && this.server.listening);
    }
}

function createErrorObject(err, message) {
    return {
        date: new Date(),
        error: err,
        message: message
    };
}

module.exports = SyslogServer;
