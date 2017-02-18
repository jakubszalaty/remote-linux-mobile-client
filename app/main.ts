// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform'

import { AppModule } from './modules/app.module'

import * as application from 'application'
// webimage
import {initializeOnAngular} from "nativescript-web-image-cache"
application.on(application.launchEvent, function (args: application.ApplicationEventData) {
    initializeOnAngular();
})

// declare var android: any

// application.android.on(application.AndroidApplication.activityResumedEvent, function (args) {
//     console.log("Event: " + args.eventName + ", Activity: " + args.activity)
//     var a = args.activity
//     try {
//         var Intent_1 = android.content.Intent
//         var actionSend = Intent_1.ACTION_SEND
//         var actionSendMultiple = Intent_1.ACTION_SEND_MULTIPLE
//         var argIntent = a.getIntent()
//         var argIntentAction = argIntent.getAction()
//         var argIntentType = argIntent.getType()
//         console.log(" ~~~~ Intent is ~~~~ :" + new String(argIntent.getAction()).valueOf())

//         // String.prototype.startsWith = function (str) {
//         //     return this.substring(0, str.length) === str
//         // }
//         // if (new String(argIntentAction).valueOf() === new String(Intent_1.ACTION_SEND).valueOf()) {
//         //     if (new String(argIntentType).valueOf() === new String("text/plain").valueOf()) {
//         //         console.dump(cbParseTextAndUrl(argIntent))
//         //     }
//         //     else if (argIntentType.startsWith("image/")) {
//         //         console.log(cbParseImageUrl(argIntent))
//         //     }
//         // }
//         // else if (new String(argIntentAction).valueOf() === new String(Intent_1.ACTION_SEND_MULTIPLE).valueOf()) {
//         //     if (argIntentType.startsWith("image/")) {
//         //         var Uri = cbParseMultipleImageUrl(argIntent)
//         //         if (Uri !== null) {
//         //             var Uris = JSON.parse(Uri)
//         //             console.log(Uris)
//         //         }
//         //     }
//         // }
//         // function cbParseTextAndUrl(argIntent) {
//         //     var Patterns = android.util.Patterns
//         //     //let Matcher = java.util.regex.Matcher
//         //     var ListUrl = []
//         //     var text = argIntent.getStringExtra(Intent_1.EXTRA_TEXT)
//         //     if (new String().valueOf() !== "null") {
//         //         var Matcher = Patterns.WEB_URL.matcher(text)
//         //         while (Matcher.find()) {
//         //             var url = Matcher.group()
//         //             ListUrl.push(url)
//         //         }
//         //         return { "text": text, "listUrl": ListUrl }
//         //     }
//         // }
//         // function cbParseImageUrl(argIntent) {
//         //     var imageUri = argIntent.getParcelableExtra(Intent_1.EXTRA_STREAM)
//         //     if (imageUri != null) {
//         //         // Update UI to reflect image being shared
//         //         return imageUri
//         //     }
//         // }
//         // function cbParseMultipleImageUrl(argIntent) {
//         //     var imageUris = argIntent.getParcelableArrayListExtra(Intent_1.EXTRA_STREAM)
//         //     if (imageUris != null) {
//         //         // Update UI to reflect image being shared
//         //         return JSON.stringify(imageUris.toString())
//         //     }
//         // }
//     }
//     catch (e) {
//         console.log(e)
//     }
// })

platformNativeScriptDynamic().bootstrapModule(AppModule)