
namespace car4
/*
*/ { // aktoren.ts

    let n_ServoWinkel: number
    let n_Licht: boolean


    //% group="Servo" subcategory="Aktoren"
    //% block="Servo %pWinkel"
    //% pON.shadow="toggleOnOff"
     function servo(pWinkel: number) {
        if (between(pWinkel, 45, 135) && n_ServoWinkel != pWinkel) {
            n_ServoWinkel = pWinkel
            pins.servoWritePin(pinServo, pWinkel + n_Servo_geradeaus - 90)
        }
    }


    //% group="Relais" subcategory="Aktoren"
    //% block="Relais %pON"
    //% pON.shadow="toggleOnOff"
    export function relay(pON: boolean) { pins.digitalWritePin(pinRelay, pON ? 1 : 0) }

    //% group="Hupe" subcategory="Aktoren"
    //% block="Hupe %pON"
    //% pON.shadow="toggleOnOff"
    export function buzzer(pON: boolean) { pins.digitalWritePin(pinBuzzer, pON ? 1 : 0) }

    //% group="Licht" subcategory="Aktoren"
    //% block="Licht %pON"
    //% pON.shadow="toggleOnOff"
    export function licht(pON: boolean) { pins.digitalWritePin(pinLicht, pON ? 0 : 1) }



} // aktoren.ts
