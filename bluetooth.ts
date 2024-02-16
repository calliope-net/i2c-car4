
namespace car4
/*
*/ { // radio.ts

    let n_receivedBuffer19: Buffer
    let n_sendBuffer19: Buffer

    let n_lastconnectedTime: number // ms seit Start
    let n_connected: boolean // Bluetooth connected

    export enum eBuffer {
        b0_Motor,
        b1_Servo,
        b2,
        b3,
        b4,
        b5,
        b6,
        b7
    }

    export function bluetooth_beimStart() {
        n_connected = false
        n_lastconnectedTime = input.runningTime() // Laufzeit
    }



    // ========== group="Bluetooth Verbindung" subcategory="Bluetooth"

    //% group="Bluetooth Verbindung" subcategory="Bluetooth"
    //% block="letztes Datenpaket vor > %sekunden Sekunden" weight=4
    //% sekunden.shadow=car4_ePause
    export function lastConnected(sekunden: number) {
        return (input.runningTime() - n_lastconnectedTime) / 1000 > sekunden
    }

    //% group="Bluetooth Verbindung" subcategory="Bluetooth"
    //% block="Bluetooth ist verbunden %connected" weight=3
    //% connected.shadow="toggleYesNo"
    export function setConnected(connected: boolean) { n_connected = connected }


    //% group="Bluetooth Verbindung" subcategory="Bluetooth"
    //% block="ist Bluetooth verbunden ?" weight=2
    export function isConnected() { return n_connected }




    // ========== group="Bluetooth empfangen" subcategory="Bluetooth"

    //% group="Bluetooth empfangen" subcategory="Bluetooth"
    //% block="Datenpaket einlesen %receivedBuffer19" weight=9
    export function onReceivedBuffer(receivedBuffer19: Buffer) {
        n_receivedBuffer19 = receivedBuffer19
        n_lastconnectedTime = input.runningTime()
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth"
    //% block="Datenpaket enthält %pOffset" weight=8
    export function receivedBuffer_Contains(pOffset: eBuffer): boolean {
        if (n_receivedBuffer19 && n_receivedBuffer19.length > pOffset)
            switch (pOffset) {
                case eBuffer.b1_Servo: return (between(n_receivedBuffer19.getUint8(pOffset), 45, 135))
                default: return true
            }
        else
            return false
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth"
    //% block="Byte lesen %pOffset" weight=7
    export function receivedBuffer_getUint8(pOffset: eBuffer) {
        if (receivedBuffer_Contains(pOffset)) {
            return n_receivedBuffer19.getUint8(pOffset)
            /* let b = n_receivedBuffer19.getUint8(pOffset)
            switch (pOffset) {
                case eBuffer.b1_Servo: {
                    if (between(b, 90, 135))
                        return b
                    else
                        return 90
                }
                default: return b
            } */
        } else
            return 0
    }

    // ========== group="Bluetooth senden" subcategory="Bluetooth"

    //% group="Bluetooth senden" subcategory="Bluetooth"
    //% block="sende Buffer" weight=2
    export function sendBuffer() {
        radio.sendBuffer(n_sendBuffer19)
    }


} // radio.ts