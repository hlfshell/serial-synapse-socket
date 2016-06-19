"use strict"

var WebSocketServer = require('ws').Server;

class SynapseServer{
	
	constructor(opts){
		var self = this;
		
		if(!opts.port) throw new Error("SynapseServer requires a port to be set");
		
		if(!opts.synapse ||
			typeof opts.synapse != 'object' ||
			opts.synapse.constructor.name != "Synapse"){
			throw new Error("SynapseServer requires a synapse object to be passed to it on creation");		
		}
		
		this._synapse = opts.synapse;
		
		this._parseUpdateHandlers();
		
		this._wss = new WebSocketServer({ port: opts.port });
		this._wss.on("connection", function(ws){
			self._onConnection(ws)
		});
	}
	
	_parseUpdateHandlers(){
		var self = this;
		
		Object.keys(self._synapse._updateHandlers).forEach(function(identifier){
			
			self._synapse._updateHandlers[identifier].then = function(data){
				data.name = self._synapse._updateHandlers[identifier].name;
				data.on = (new Date()).getTime();
				
				self.broadcast(data);
			};
			
		});
	}
	
	_onConnection(ws){
		var self = this;
		
		ws.reply = (msg)=> ws.send(JSON.stringify(msg));
		
		ws.on("message", function(msg){
			try{
				msg = JSON.parse(msg);
			} catch(err){
				ws.reply({ result: 'error', reason: 'Incoming messages must be in proper JSON format' });
			}
			
			//Validate the incoming message
			//Must have command
			if(!msg.command) return ws.reply({ result: 'error', reason: 'No command specified' });
			//Must exist
			if(!self._synapse._commands[msg.command]) return ws.reply({ result: 'error', reason: 'No such command found' });
			
			if(!msg.args) msg.args = [];
			if(!(msg.args instanceof Array)) msg.args = [msg.args]; 
			
			if(!self._synapse._commands[msg.command].silent){
				var cb = function(err, data){
					if(err) return ws.reply({ result: 'error', reason: err });
					if(!data.result) data.result = 'success';
					ws.reply(data);
				};
				msg.args.push(cb);
			}
			
			self._synapse[msg.command].apply(self._synapse, msg.args);
		});
	}
	
	broadcast(msg){
		try{
			msg = JSON.stringify(msg);
		} catch(err){
			throw new Error("Could not parse message to JSON");
		}
		
		this._wss.clients.forEach(function(client){
			client.send(msg);
		});
	}
	
}

module.exports = SynapseServer;