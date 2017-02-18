import { Component, ChangeDetectionStrategy, NgZone } from '@angular/core'
import { Router } from '@angular/router'

import { SocketService } from '../../shared/socket/socket.service'

import { ObservableArray } from 'data/observable-array'
import { Observable } from 'data/observable'

@Component({
    selector: 'home',
    templateUrl: 'modules/pages/home/home.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SocketService]
})


export class HomeComponent {
    // public items: Array<DataItem>
    public tabSelectedIndex: number

    public ipAddress: string = '192.168.0.2'

    public tmpImage: string = 'http://vignette4.wikia.nocookie.net/nocopyrightsounds/images/f/fe/Spotify-icon.jpg/revision/latest/scale-to-width-down/480?cb=20151216175322'

    public isLoadingServers: boolean = false

    public urlAddress: string

    constructor(private router: Router, private socket: SocketService, private _ngZone: NgZone) {
        this.tabSelectedIndex = 3
    }

    public get serversIps(): ObservableArray<string> {
        return this.socket.serversIps
    }

    public get spotifyInfo(): Object {
        // console.log('getSpotifyInfo')
        return this.socket.spotifyInfo
    }

    public get commandsList(): ObservableArray<string> {
        return this.socket.commandsList
    }

    public connect(ipAddress: string) {
        this.socket.connect(ipAddress).then(() => {
            // this.tabSelectedIndex = 0
            alert('Connected')
        }).catch(err => {
            alert(err)
        })
        // this.router.navigate(["/about"])
    }
    public disconnect() {
        this.socket.disconnect()
    }
    public search() {
        this.isLoadingServers = true
        this.socket.search().then(() => {
            this.isLoadingServers = false
        })
    }
    // public getCommandsList() {
    //     this.socket.getCommandsList()
    // }
    public sendCommand(command: string) {
        this.socket.sendCommand(command)
    }
    public openUrl() {
        this.socket.sendCommand('openUrl', { url: this.urlAddress }).then(() => {
            this.urlAddress = ''
        }).catch(err => {
            alert(err)
        })
        // this.router.navigate(["/about"])
    }
}

