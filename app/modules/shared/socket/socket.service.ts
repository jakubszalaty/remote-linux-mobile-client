import { Injectable, NgZone } from '@angular/core'

import * as application from 'application'

import { ObservableArray } from 'data/observable-array'

declare var android: any

const SocketIO = require('nativescript-socketio').SocketIO
@Injectable()
export class SocketService {
    public commandsList: ObservableArray<string>

    public spotifyInfo: Object

    public serversIps: ObservableArray<string>

    public shotImage: string = null

    private socket
    private connected: Boolean = false

    private broadcastAddress: number[] = null
    private port: number


    constructor(private ngZone: NgZone) {
        this.port = 1337
        // this.socket = new SocketIO('http://192.168.0.2:1337',{'connect timeout': 2000})
        // this.socket = new SocketIO(`http://${ipAddress}`,{'connect timeout': 2000})

        if (application.android) {
            // console.dump(app.android)
            const context = android.content.Context
            const wifiManager = application.android.context.getSystemService(context.WIFI_SERVICE)
            const dInfo = wifiManager.getDhcpInfo()
            // tslint:disable-next-line:no-bitwise
            this.broadcastAddress = this.getIpFromInt((dInfo.ipAddress & dInfo.netmask) | ~dInfo.netmask)
            // console.log(this.getStringIpFromInt( (dInfo.ipAddress & dInfo.netmask) | ~dInfo.netmask) )
            // console.log(this.getIpFromInt(dInfo.gateway))
            // console.log(this.getIpFromInt(dInfo.netmask))
            // console.log(this.getIpFromInt(dInfo.serverAddress))
            // console.log(this.getIpFromInt(dInfo.ipAddress))
            // this.search()
            application.android.on(application.AndroidApplication.activityResumedEvent, (args) => {
                // console.log("Event: " + args.eventName + ", Activity: " + args.activity)
                const a = args.activity
                const Intent = android.content.Intent
                const actionSend = Intent.ACTION_SEND
                const actionSendMultiple = Intent.ACTION_SEND_MULTIPLE
                const argIntent = a.getIntent()
                const argIntentAction = argIntent.getAction()
                const argIntentType = argIntent.getType()

                // console.log(" ~~~~ Intent is ~~~~ :" + argIntentAction)
                if (argIntentType === 'text/plain') {
                    const url: string = argIntent.getStringExtra(Intent.EXTRA_TEXT)
                    this.sendCommand('openUrl', { url })
                }

            })
        }

    }

    public search() {
        this.serversIps = new ObservableArray([])
        const promises: Promise<any>[] = []

        for (let i = 2; i < this.broadcastAddress[3]; i++) {
            promises.push(new Promise((resolve, reject) => {
                // tslint:disable-next-line:max-line-length
                const address = `${this.broadcastAddress[0]}.${this.broadcastAddress[1]}.${this.broadcastAddress[2]}.${i}`
                const socket = new SocketIO(`http://${address}:${this.port}`, { 'connect timeout': 2000 })
                socket.on('connect_error', () => {
                    socket.disconnect()
                    return resolve()
                })
                socket.on('connect', () => {
                    console.log('OK:', `http://${address}:${this.port}`)
                    this.serversIps.push(address)
                    socket.disconnect()
                    return resolve()
                })
                socket.connect()
            }))
        }
        return Promise.all(promises)
    }
    public connect(serverIpAddress: string) {
        return new Promise((resolve, reject) => {

            this.socket = new SocketIO(`http://${serverIpAddress}:${this.port}`, { 'connect timeout': 2000 })

            this.socket.on('connect_error', () => {
                this.connected = false
                this.socket.disconnect()
                return reject('connect_error')
            })
            this.socket.on('connect', () => {
                this.connected = true
                this.commandsList = null
                return resolve(this.getCommandsList())
            })

            this.socket.on('disconnect', () => {
                console.log('disconnect')
                this.connected = false
                this.commandsList = null
            })

            this.socket.on('sendShot', (data) => {
                this.ngZone.run(() => {
                    this.shotImage = data
                })
            })

            // this.socket.on('test_connection', (response)=>{ alert(response.data) })

            this.socket.on('commands_list', (response) => {
                this.commandsList = new ObservableArray(response.data)
            })

            this.socket.on('spotifyInfo', (response) => {
                console.log('getting')
                this.ngZone.run(() => {
                    // console.log('ngZone')
                    this.spotifyInfo = response
                })
            })

            this.socket.connect()
        })
    }

    public disconnect() {
        if (this.socket)
            this.socket.disconnect()
    }


    public getCommandsList() {
        return new Promise((resolve, reject) => {
            if (this.connected)
                return resolve(this.socket.emit('get_commands_list'))
            else
                return reject('Not connected')
        })
    }

    public sendCommand(command: string, data?: Object) {
        return new Promise((resolve, reject) => {
            if (this.connected)
                return resolve(this.socket.emit(command, data))

            else
                return reject('Not connected')
        })

    }

    private getIpFromInt(int: number) {
        // tslint:disable:no-bitwise
        const part1 = int & 255
        const part2 = ((int >> 8) & 255)
        const part3 = ((int >> 16) & 255)
        const part4 = ((int >> 24) & 255)
        // return part1 + '.' + part2 + '.' + part3 + '.' + part4
        return [part1, part2, part3, part4]
    }

    private getStringIpFromInt(int: number) { return this.getIpFromInt(int).join('.') }
}

