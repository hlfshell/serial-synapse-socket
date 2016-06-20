# synapse-serial-socket
Given a synapse object, create a socket server for the device. This is an accessory module for [Serial Synapse](https://github.com/hlfshell/serial-synapse).

#Install
```
npm install serial-synapse-socket
```

#Example

```
//Assuming you created a synapse object called synapse

var SynapseServer = require('serial-synapse-socket');
var server = new SynapseServer({
  port: 8080,
  synapse: synapse
});
```

...That's it!

#Command syntax
synapse-serial-socket is expecting incoming messages to always be a JSON formatted message. It requires a command attribute, and and args attribute. If it is a single argument, you can just send it alone. Multiple arguments can be sent in an array in the order they are to be sent.

For example:
```
{
  "command": "drive",
  "args": 255
}
//OR
{
  "command": "stepDistance",
  "args": [1, 217]
}
```

#Example

I've put together [a quick example](https://github.com/hlfshell/redbot-synapse-example) using a sub $100 robot you can buy off of Sparkfun.

#TODO
1 - There is no authentication yet

2 - Your update functions (*then*) are overridden in this version with one that broadcasts the data to all connected clients.
