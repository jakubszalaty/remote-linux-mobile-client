import { Injectable } from '@angular/core'

const SocketIO = require('nativescript-socketio').SocketIO

@Injectable()
export class SocketService {
    private socket
    private connected: Boolean = false

    public commandsList: Array<string> = null

    constructor() {
        // this.socket = new SocketIO('http://192.168.0.2:1337',{'connect timeout': 2000})
        this.socket = new SocketIO('http://192.168.0.138:1337',{'connect timeout': 2000})
    }

    connect() {
        const self = this
        self.socket.on('connect_error', function(){
            console.log('connect_error')
            self.connected = false
            self.socket.disconnect()
        })
        self.socket.on('connect', function(){
            console.log('connect')
            self.connected = true
            self.commandsList = null
        })
        self.socket.on('disconnect', function(){
            console.log('disconnect')
            self.connected = false
        })

        self.socket.on('test_connection', function(response){
            alert(response.data)
        })

        self.socket.on('commands_list', function(response){
            // console.log(response.data)
            self.commandsList = response.data
        })

        self.socket.connect()
    }

    disconnect() {
        this.socket.disconnect()
    }

    getCommandsList() {
        if (this.connected)
            this.socket.emit('get_commands_list')
        else
            alert('Not connected')
    }

    sendCommand(command: string){
        if (this.connected)
            this.socket.emit(command)
        else
            alert('Not connected')

    }

}