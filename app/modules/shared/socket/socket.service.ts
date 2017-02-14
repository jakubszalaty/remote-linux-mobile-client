import { Injectable } from '@angular/core'

import * as application from 'application'

declare var android: any

const SocketIO = require('nativescript-socketio').SocketIO
@Injectable()
export class SocketService {
    private socket
    private connected: Boolean = false

    public commandsList: Array<string> = null

    public serversIps: Array<string> = null
    private broadcastAddress: Array<number> = null
    private port: number = 1337
    constructor() {
        // this.socket = new SocketIO('http://192.168.0.2:1337',{'connect timeout': 2000})
        // this.socket = new SocketIO(`http://${ipAddress}`,{'connect timeout': 2000})
        if (application.android) {
            // console.dump(app.android)
            const context = android.content.Context
            const wifiManager = application.android.context.getSystemService(context.WIFI_SERVICE)
            const dInfo = wifiManager.getDhcpInfo()
            this.broadcastAddress = this.getIpFromInt( (dInfo.ipAddress & dInfo.netmask) | ~dInfo.netmask )
            // console.log(this.getStringIpFromInt( (dInfo.ipAddress & dInfo.netmask) | ~dInfo.netmask) )
            // console.log(this.getIpFromInt(dInfo.gateway))
            // console.log(this.getIpFromInt(dInfo.netmask))
            // console.log(this.getIpFromInt(dInfo.serverAddress))
            // console.log(this.getIpFromInt(dInfo.ipAddress))
            // this.search()
        }
    }

    search() {
        this.serversIps = []
        for (let i = 2; i < this.broadcastAddress[3]; i++){

            const address = `${this.broadcastAddress[0]}.${this.broadcastAddress[1]}.${this.broadcastAddress[2]}.${i}`
            const socket = new SocketIO(`http://${address}:${this.port}`, { 'connect timeout': 2000 })
            socket.on('connect_error', () => {
                // console.log('Error:', `http://${address}:${this.port}`)
                socket.disconnect()
            })
            socket.on('connect', () => {
                console.log('OK:', `http://${address}:${this.port}`)
                this.serversIps.push(address)
                socket.disconnect()
            })
            socket.connect()
        }
    }
    connect(serverIpAddress:string) {
        return new Promise((resolve,reject)=>{

            this.socket = new SocketIO(`http://${serverIpAddress}:${this.port}`, { 'connect timeout': 2000 })

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

    disconnect() { this.socket.disconnect() }

    private getIpFromInt(int: number) {
        const part1 = int & 255
        const part2 = ((int >> 8) & 255)
        const part3 = ((int >> 16) & 255)
        const part4 = ((int >> 24) & 255)
        // return part1 + '.' + part2 + '.' + part3 + '.' + part4
        return [part1,part2,part3,part4]
    }

    private getStringIpFromInt(int: number) { return this.getIpFromInt(int).join('.') }

    public getCommandsList() {
        return new Promise((resolve, reject) => {
            if (this.connected)
                return resolve(this.socket.emit('get_commands_list'))
            else
                return reject('Not connected')
        })
    }

    public sendCommand(command: string){
        return new Promise((resolve, reject) => {
            if (this.connected)
                return resolve(this.socket.emit(command))

            else
                return reject('Not connected')
        })

    }

}