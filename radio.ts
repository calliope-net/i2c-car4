
namespace car4
/*
*/ { // radio.ts

    let n_sendBuffer19: Buffer
    let n_receivedBuffer19: Buffer

    enum eBuffer {
        b0Motor,
        b1Servo,
        b2,
        b3

    }

    export let n_runningTime: number    // ms seit Start
    export let n_connected: boolean     // Bluetooth connected

    //% group="Bluetooth"
    //% block="set ReceivedBuffer %receivedBuffer19" weight=5
    export function onReceivedBuffer(receivedBuffer19: Buffer) {
        n_receivedBuffer19 = receivedBuffer19
        n_runningTime = input.runningTime()
    }

    //% group="Bluetooth"
    //% block="ReceivedBuffer contains %pOffset" weight=4
    export function receivedBufferContains(pOffset: eBuffer): boolean {
        return n_receivedBuffer19 && n_receivedBuffer19.length > pOffset
    }





    //% group="Bluetooth"
    //% block="sende Buffer" weight=4
    export function sendBuffer() {
        radio.sendBuffer(n_sendBuffer19)
    }


} // radio.ts