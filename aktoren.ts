
namespace car4
/*
*/ { // aktoren.ts

    //let n_ServoWinkel: number
    let n_Licht: boolean



    //% group="Relais" subcategory="Aktoren"
    //% block="Relais %pON"
    //% pON.shadow="toggleOnOff"
    export function relay(pON: boolean) { pins.digitalWritePin(pinRelay, pON ? 1 : 0) }


    //% group="Hupe" subcategory="Aktoren"
    //% block="Hupe %pON"
    //% pON.shadow="toggleOnOff"
    export function buzzer(pON: boolean) { pins.digitalWritePin(pinBuzzer, pON ? 1 : 0) }


    //% group="Licht" subcategory="Aktoren"
    //% block="Licht %pON" weight=3
    //% pON.shadow="toggleOnOff"
    export function licht(pON: boolean) {
        n_Licht = pON
        pins.digitalWritePin(pinLicht, pON ? 0 : 1)
    }

    //% group="Licht" subcategory="Aktoren"
    //% block="Licht an ?" weight=2
    export function getlicht() { return n_Licht }



} // aktoren.ts
