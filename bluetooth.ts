
namespace car4
/*
*/ { // bluetooth.ts

    let n_receivedBuffer19: Buffer

    export enum eBufferPointer {
        p0 = 1, p1 = 4, p2 = 7, p3 = 10, p4 = 13, p5 = 16
    }
    let n_BufferPointer: eBufferPointer = eBufferPointer.p0 // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16

    let n_lastconnectedTime: number // ms seit Start
    let n_connected: boolean // Bluetooth connected

    export enum eBufferOffset { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        b0_Motor = 0, // 0..128..255
        b1_Servo = 1, // Bit 4-0 (0..31)
        b2_Fahrstrecke = 2, // Encoder in cm max. 255cm
        b1_Bits = 3 // Bit 7-6-5
    }


    export function bluetooth_beimStart() {
        n_connected = false
        n_lastconnectedTime = input.runningTime() // Laufzeit
    }




    // ========== Bluetooth Event ==========

    let onReceivedBufferHandler: (receivedBuffer: Buffer) => void
    //let onReceivedBufferHandler2: () => void

    // Event (aus radio) wenn Buffer empfangen
    radio.onReceivedBuffer(function (receivedBuffer) {
        n_receivedBuffer19 = receivedBuffer

        if (car4ready()) { // beim ersten Mal warten bis Motor bereit
            n_connected = true // wenn Start und Motor bereit, setze auch Bluetooth connected
            licht(false, false) //  Licht aus und Blinken beenden

            n_lastconnectedTime = input.runningTime() // Connection-Timeout Zähler zurück setzen

            if (onReceivedBufferHandler)
                onReceivedBufferHandler(receivedBuffer) // Ereignis Block auslösen, nur wenn benutzt
        }
    })



    // ========== group="Bluetooth Verbindung" subcategory="Bluetooth"

    //% group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
    //% block="wenn bereit und Datenpaket empfangen" weight=9
    //% draggableParameters=reporter
    export function onReceivedData(cb: (receivedBuffer: Buffer) => void) {
        onReceivedBufferHandler = cb
        //radio.onReceivedBuffer(cb)
    }

    //% block="wenn Datenpaket empfangen" subcategory="Bluetooth" color=#E3008C
    /* export function onReceivedData2(cb: () => void) {
        onReceivedBufferHandler2 = cb;
    } */


    //% group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
    //% block="Timeout || nach %timeout s, aus nach %ausschalten s, Licht %lichtan, blinken %blinken" weight=8
    //% timeout.defl=1 ausschalten.defl=60 lichtan.defl=1 blinken.defl=1
    //% lichtan.shadow="toggleOnOff" blinken.shadow="toggleOnOff"
    //% inlineInputMode=inline expandableArgumentMode=toggle
    export function bluetooth_timeout(timeout?: number, ausschalten?: number, lichtan = true, blinken = true) {
        if (car4ready()) { // beim ersten Mal warten bis Motor bereit
            if (lastConnected(ausschalten))
                relay(false) // nach 60 s ohne Bluetooth Relais aus schalten
            else if (n_connected && lastConnected(timeout))
                n_connected = false // nach 1 s disconnected
            else if (!n_connected)
                licht(lichtan, blinken)
            return !n_connected // true wenn disconnected, also timeout eingetreten
        } else
            return false
    }



    //% group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
    //% block="letztes Datenpaket vor > %sekunden Sekunden" weight=4
    //% sekunden.shadow=car4_ePause
    export function lastConnected(sekunden: number) {
        return (input.runningTime() - n_lastconnectedTime) / 1000 > sekunden
    }

    //% group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
    //% block="Bluetooth connected %connected" weight=3
    //% connected.shadow="toggleYesNo"
    export function setConnected(connected: boolean) { n_connected = connected }


    //% group="Bluetooth Verbindung" subcategory="Bluetooth" color=#E3008C
    //% block="Bluetooth connected" weight=2
    export function isConnected() { return n_connected }

    export function receivedBuffer_hex() {
        if (n_receivedBuffer19) return n_receivedBuffer19.toHex()
        else return "-Buffer-"
    }



    // ========== group="Bluetooth empfangen" subcategory="Bluetooth"

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Datenpaket einlesen %receivedBuffer19" weight=9
    /* export function receivedBuffer_set(receivedBuffer19: Buffer) {
        n_receivedBuffer19 = receivedBuffer19
        //let servo = n_receivedBuffer19.getUint8(eBufferOffset.b1_Servo)
        //if (between(servo, 1, 31))
        //    n_receivedBuffer19.setUint8(eBufferOffset.b1_Servo, (servo + 14) * 3)
        //n_receivedBuffer19.setUint8(eBuffer.b1_Servo, (n_receivedBuffer19.getUint8(eBuffer.b1_Servo) + 14) * 3)
        n_lastconnectedTime = input.runningTime()
    } */

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Datenpaket gültig || enthält %pBufferPointer | " weight=8
    export function receivedBuffer_Contains(pBufferPointer?: eBufferPointer): boolean {
        // wenn optionaler Parameter fehlt
        if (!pBufferPointer) pBufferPointer = n_BufferPointer // 1, 4, 7, 10, 13, 16
        return (n_receivedBuffer19 && (n_receivedBuffer19.length > (pBufferPointer + 2))) // max 18
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Byte lesen %pOffset || %pBufferPointer " weight=7
    export function receivedBuffer_getUint8(pBufferOffset: eBufferOffset, pBufferPointer?: eBufferPointer) {
        //basic.showNumber(pBufferPointer)

        if (!pBufferPointer) pBufferPointer = n_BufferPointer // wenn nicht angegeben internen Wert nehmen
        if (receivedBuffer_Contains(pBufferPointer)) {
            let r = n_receivedBuffer19.getUint8(pBufferPointer + pBufferOffset)
            switch (pBufferOffset) {
                case eBufferOffset.b1_Servo: {  // Servo 1..31 +14 15..45 *3 45..135
                    return ((r & 0b00011111) + 14) * 3
                }
                case eBufferOffset.b1_Bits: return r >>> 5 // r & 0b11100000 // Bits 0..7
                default: return r // b0_Motor und b2_Fahrstrecke 0..255
            }
        } else return 0
    }



    export enum eBufferBit {
        //% block="Motor Power"
        x80_MotorPower,
        //% block="Hupe"
        x40_Hupe,
        //% block="connected & fahren Joystick"
        fahrenJostick,
         //% block="connected & fahren Strecke"
        fahrenStrecke
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Steuer-Byte 0 %pBit" weight=6
    export function receivedBuffer_getBit(pBit: eBufferBit) {
        let byte0 = n_receivedBuffer19.getUint8(0)
        switch (pBit) {
            //case eBit.b2_Joystick: return receivedBuffer_getUint8(eBuffer.b2_Fahrstrecke) == 0
            //case eBit.b2_Encoder: return receivedBuffer_getUint8(eBuffer.b2_Fahrstrecke) > 0
            case eBufferBit.x80_MotorPower: return (byte0 & 0x80) == 0x80
            case eBufferBit.x40_Hupe: return (byte0 & 0x40) == 0x40

            case eBufferBit.fahrenJostick: return n_connected && (byte0 & 0x03) == 0x00 // 000
            case eBufferBit.fahrenStrecke: return n_connected && (byte0 & 0x03) != 0x00 // 001 010 111
            default: return false
        }
    }


    /* 
        // ========== group="Bluetooth senden" subcategory="Bluetooth"
    
        //% group="Bluetooth senden" subcategory="Bluetooth"
        //% block="sende Buffer" weight=2
        export function sendBuffer() {
            radio.sendBuffer(n_sendBuffer19)
        }
     */

} // bluetooth.ts