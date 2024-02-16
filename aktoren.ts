
namespace car4
/*
*/ { // aktoren.ts

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
    //% block="Licht %pON || blinken %pBlink" weight=6
    //% pON.shadow="toggleOnOff" pBlink.shadow="toggleOnOff"
    export function licht(pON: boolean, pBlink = false) {
        if (pON && pBlink)
            n_Licht = !n_Licht
        else
            n_Licht = pON
        pins.digitalWritePin(pinLicht, n_Licht ? 0 : 1) // an bei digitalem Wert 0
    }

    //% group="Licht" subcategory="Aktoren"
    //% block="Licht an ?" weight=4
    export function licht_get() { return n_Licht }

    //% group="Licht" subcategory="Aktoren"
    //% block="Licht aus < %aus an > %an bei Helligkeit" weight=2
    //% aus.defl=200 an.defl=300
    export function licht_sensor(aus: number, an: number) {
        if (n_Licht && helligkeit_vergleich(eVergleich.lt, aus)) {
            licht(false)
        } else if (!n_Licht && helligkeit_vergleich(eVergleich.gt, an)) {
            licht(true)
        }
    }


} // aktoren.ts
