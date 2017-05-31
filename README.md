# SyslogServer

NodeJS Syslog Server.

### Quickstart

###### Installation
```shell
$ npm install syslog-server
```

###### Usage
```javascript
const SyslogServer = require("syslog-server");
const server = new SyslogServer();

server.on("message", (value) => {
    console.log(value.date);     // the date/time the message was received
    console.log(value.host);     // the IP address of the host that sent the message
    console.log(value.protocol); // the version of the IP protocol ("IPv4" or "IPv6")
    console.log(value.message);  // the syslog message
});

server.start();
```

### Functions

###### .start([options], [callback])

- **options** <Object> - Optional - The options passed to the server. Supports the following properties:
    - port [Number] - Optional - Defaults to 514.
    - address [String] - Optional - Defaults to "0.0.0.0".
    - exclusive [Boolean] - Optional - Defaults to true.

    For more informatio on the options object, check NodeJS oficial [API documentation](https://nodejs.org/api/dgram.html#dgram_socket_bind_options_callback).

- **callback** [Function] - Optional - Callback function called once the server starts, receives an error object as argument should it fail.

The start function returns a Promise.

###### .stop([callback])

- **callback** [Function] - Optional - Callback function called once the server socket is closed, receives an error object as argument should it fail.

The stop function returns a Promise.

###### .isRunning()

The isRunning function is a synchronous function that returns a boolean value, if the server is ready to receive syslog messages or not.

### Events

- **start** - fired once the server is ready to receive syslog messages
- **stop** - fired once the server is shutdown
- **error** - fired whenever an error occur, an error object is passed to the handler function
- **message** - fired once the server receives a syslog message
