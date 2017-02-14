import { Injectable } from '@angular/core'

const SocketIO = require('nativescript-socketio').SocketIO

@Injectable()
export class SocketService {
    private socket
    private connected: Boolean = false

    public commandsList: Array<string> = null

    public ipAddress: string = "192.168.0.138:1337"

    constructor() {
        // this.socket = new SocketIO('http://192.168.0.2:1337',{'connect timeout': 2000})
        // this.socket = new SocketIO(`http://${ipAddress}`,{'connect timeout': 2000})
    }

    connect() {
        return new Promise((resolve,reject)=>{

            this.socket = new SocketIO(`http://${this.ipAddress}`, { 'connect timeout': 2000 })

            this.socket.on('connect_error', ()=>{
                this.connected = false
                this.socket.disconnect()
                return reject('connect_error')
            })
            this.socket.on('connect', ()=>{
                this.connected = true
                this.commandsList = null
                return resolve(this.getCommandsList())
            })
            this.socket.on('disconnect', ()=>{
                console.log('disconnect')
                this.connected = false
                this.commandsList = null
            })

            // this.socket.on('test_connection', (response)=>{ alert(response.data) })

            this.socket.on('commands_list', (response)=>{ this.commandsList = response.data })

            this.socket.connect()
        })
    }

    disconnect() {
        this.socket.disconnect()
    }

    getCommandsList() {
        return new Promise((resolve, reject) => {
            if (this.connected)
                return resolve(this.socket.emit('get_commands_list'))
            else
                return reject('Not connected')
        })
    }

    sendCommand(command: string){
        return new Promise((resolve, reject) => {
            if (this.connected)
                return resolve(this.socket.emit(command))

            else
                return reject('Not connected')
        })

    }

}