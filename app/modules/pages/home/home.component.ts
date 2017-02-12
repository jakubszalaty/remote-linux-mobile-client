import { Component, ChangeDetectionStrategy } from '@angular/core'
import { Router } from '@angular/router'

import { SocketService } from '../../shared/socket/socket.service'


@Component({
    selector: 'home',
    templateUrl: 'modules/pages/home/home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ SocketService ]
})

// export class DataItem {
//     constructor(public itemDesc: string) { }
// }

export class HomeComponent {
    // public items: Array<DataItem>
    public tabSelectedIndex: number

    constructor(private router: Router, private socket: SocketService) {
        this.tabSelectedIndex = 1
        // this.items = new Array<DataItem>()
        // for (let i = 0; i < 5; i++) {
        //     this.items.push(new DataItem("item " + i))
        // }

    }

    public get commandsList(): Array<string> {
        return this.socket.commandsList
    }

    public connect() {
        this.socket.connect()
        // this.router.navigate(["/about"])
    }
    public disconnect() {
        this.socket.disconnect()
    }
    public getCommandsList() {
        this.socket.getCommandsList()
    }
    public sendCommand(command: string) {
        this.socket.sendCommand(command)
    }
}

