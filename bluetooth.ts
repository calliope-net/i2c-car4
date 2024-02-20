
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

    export enum eBuffer { // 3 Byte (b0-b1-b2) ab n_BufferPointer
        b0_Motor, // 0..128..255
        b1_Servo, // Bit 4-0 (0..31)
        b2_Fahrstrecke, // Encoder in cm max. 255cm
        b1_Bits // Bit 7-6-5
    }

    export enum eBit {
        //% block="b2=0 fahren mit Joystick"
        b2_Joystick,
        //% block="b2>0 fahren Strecke cm"
        b2_Encoder,
        //% block="x80 Motor Power"
        x80_MotorPower

    }

    export function bluetooth_beimStart() {
        n_connected = false
        n_lastconnectedTime = input.runningTime() // Laufzeit
    }



    // ========== group="Bluetooth Verbindung" subcategory="Bluetooth"

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




    // ========== group="Bluetooth empfangen" subcategory="Bluetooth"

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Datenpaket einlesen %receivedBuffer19" weight=9
    export function onReceivedBuffer(receivedBuffer19: Buffer) {
        n_receivedBuffer19 = receivedBuffer19
        let servo = n_receivedBuffer19.getUint8(eBuffer.b1_Servo)
        if (between(servo, 1, 31))
            n_receivedBuffer19.setUint8(eBuffer.b1_Servo, (servo + 14) * 3)
        //n_receivedBuffer19.setUint8(eBuffer.b1_Servo, (n_receivedBuffer19.getUint8(eBuffer.b1_Servo) + 14) * 3)
        n_lastconnectedTime = input.runningTime()
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Datenpaket gültig || enthält %pBufferPointer" weight=8
    export function receivedBuffer_Contains(pBufferPointer?: eBufferPointer): boolean {
        if (!pBufferPointer) pBufferPointer = n_BufferPointer
        // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16
        return (n_receivedBuffer19 && n_receivedBuffer19.length > ((n_BufferPointer * 3) + 3)) // max 18
        /* 
                let lPointer = (n_BufferPointer * 3) + 1 // n=0..5 (n*3)+1 = 1, 4, 7, 10, 13, 16
        
                if (n_receivedBuffer19 && n_receivedBuffer19.length > lPointer + 2) // max 18
                    switch (pOffset) {
                        case eBuffer.b1_Servo: return (between(n_receivedBuffer19.getUint8(pOffset), 45, 135))
        
                        //case eBuffer.b1_Servo: {
                        //    n_receivedBuffer19.setUint8(pOffset, (n_receivedBuffer19.getUint8(pOffset) + 14) * 3)
                        //    return (between(n_receivedBuffer19.getUint8(pOffset), 45, 135))
                        //}
        
                        default: return true
                    }
                else
                    return false */
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Byte lesen %pOffset || %pBufferPointer " weight=7
    export function receivedBuffer_getUint8(pOffset: eBuffer, pBufferPointer?: eBufferPointer) {
        //basic.showNumber(pBufferPointer)
        if (!pBufferPointer) pBufferPointer = n_BufferPointer // wenn nicht angegeben internen Wert nehmen
        if (receivedBuffer_Contains(pBufferPointer))
            return n_receivedBuffer19.getUint8(pBufferPointer + pOffset)
        else
            return 0
    }

    //% group="Bluetooth empfangen" subcategory="Bluetooth" color=#E3008C
    //% block="Bit lesen %pBit" weight=6
    export function receivedBuffer_getBit(pBit: eBit) {
        switch (pBit) {
            //case eBit.b2_Joystick: return receivedBuffer_getUint8(eBuffer.b2_Fahrstrecke) == 0
            //case eBit.b2_Encoder: return receivedBuffer_getUint8(eBuffer.b2_Fahrstrecke) > 0
            //case eBit.x80_MotorPower: return (receivedBuffer_getUint8(eBuffer.b3_Bits) & 0x80) == 0x80

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