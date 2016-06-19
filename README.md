# synapse-serial-socket
Given a synapse object, create a socket server for the device. This is an accessory module for [Serial Synapse](https://github.com/hlfshell/serial-synapse).

#Instal
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
'''

...That's it!

#Note
1 - There is no authentication yet
2 - Your update functions (*then*) are overridden in this version with one that broadcasts the data to all connected clients.
