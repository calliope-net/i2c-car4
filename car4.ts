//% color=#007F00 icon="\uf0d1" block="CaR 4" weight=28
//% groups='["beim Start","Motor","Servo"]'
namespace car4
/* 240213 calliope-net.github.io/car4 f188

 */ {
    // I²C Adressen sind in qwiicmotor.ts und wattmeter.ts definiert
    // alle PINs:
    export const pinRelay = DigitalPin.P0          // 5V Grove Relay
    export const pinFototransistor = AnalogPin.P1  // GND fischertechnik 36134 Fototransistor
    export const pinEncoder = DigitalPin.P2        // 5V fischertechnik 186175 Encodermotor Competition
    export const pinBuzzer = DigitalPin.P3         // 5V Grove Buzzer
    export const pinServo = AnalogPin.C4           // 5V fischertechnik 132292 Servo
    const pin5 = DigitalPin.C5              // Draht blau
    const pin6 = DigitalPin.C6              // Draht gelb
    export const pinLicht = DigitalPin.C7          // 5V Licht
    export const pinUltraschall = DigitalPin.C8    // 5V Grove Ultrasonic
    export const pinSpurrechts = DigitalPin.C9     // 9V fischertechnik 128598 IR-Spursensor
    //const pin10 = DigitalPin.C10
    export const pinSpurlinks = DigitalPin.C11     // 9V fischertechnik 128598 IR-Spursensor

    //const i2cLCD20x4 = lcd20x4.eADDR.LCD_20x4       // 0x72 qwiic 20x4
    //const i2cMotor = qwiicmotor.eADDR.Motor_x5D
    //const i2cWattmeter = wattmeter.eADDR.Watt_x45

    const n_Simulator: boolean = ("€".charCodeAt(0) == 8364)
    let n_Log = "" // Anzeige auf Display nach Start
    let n_Servo_geradeaus = 90 // Winkel für geradeaus wird beim Start eingestellt
    let n_ServoWinkel = 90 // aktuell eingestellter Winkel
    let n_ready = false

    //let n_Connected: boolean
    //let iLaufzeit: number // ms seit Start
    //let iFahrstrecke: number

    //let dBlink = 0
    //let iServo = 0
    //let iEncoder = 0
    //let iMotor = 0
    //let bLicht = false


    // ========== group="beim Start"

    //% group="beim Start"
    //% block="CaR4 beim Start Funkgruppe %funkgruppe Servo ↑ %winkel ° || Calibration %calibration_value " weight=8
    //% funkgruppe.min=0 funkgruppe.max=255 funkgruppe.defl=240
    //% winkel.min=81 winkel.max=99 winkel.defl=90
    //% calibration_value.defl=4096
    //% inlineInputMode=inline 
    export function beimStart(funkgruppe: number, winkel: number, calibration_value?: number) {
        let tx: string

        // Parameter
        radio.setGroup(funkgruppe)
        n_Servo_geradeaus = winkel

        relay(true) // Relais an schalten (PIN 0)


        // I²C Module initialisieren und Fehler anzeigen
        if (!n_Simulator) {
            if (calibration_value != 0)
                if (!wattmeterReset(calibration_value)) {
                    tx = Buffer.fromArray([i2cWattmeter]).toHex()
                    n_Log += tx + " "
                    basic.showString(tx) // zeige fehlerhafte i2c-Adresse als HEX
                } else if (wattmeterakkuleer()) {
                    n_Log += " Akku laden"
                }

            if (!motorReset()) {
                tx = Buffer.fromArray([i2cMotor]).toHex()
                n_Log += tx + " "
                basic.showString(tx) // zeige fehlerhafte i2c-Adresse als HEX
            }
        }

        // PINs ab PIN 4:
        led.enable(false) // Matrix deaktivieren (erst nach showString), um PINs zu benutzen
        servo(n_Servo_geradeaus) // Servo PIN PWM
        pins.setPull(pinEncoder, PinPullMode.PullUp) // Encoder PIN Eingang PullUp

        // in bluetooth.ts:
        bluetooth_beimStart()

        if (n_Log.length = 0) {
            n_Log = "CaR 4 bereit"
            n_ready = true
        }
    }

    //% group="beim Start"
    //% block="CaR4 bereit" weight=6
    export function car4ready() { return n_ready }



    //% group="beim Start"
    //% block="Protokoll Text" weight=4
    export function logText() { return n_Log }



    // ========== group="Servo"

    //% group="Servo"
    //% block="Servo (45° ↖ 90° ↗ 135°) %winkel °" weight=4
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function servo(winkel: number) {
        if (between(winkel, 45, 135) && n_ServoWinkel != winkel) {
            n_ServoWinkel = winkel
            pins.servoWritePin(pinServo, winkel + n_Servo_geradeaus - 90)
        }
    }
    //% group="Servo"
    //% block="Servo (45° ↖ 90° ↗ 135°)" weight=2
    export function servo_get() { return n_ServoWinkel }



    // ========== advanced=true ==========

    // ========== group="Logik" advanced=true

    //% group="Logik" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=1
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }



    // ========== group="Text" advanced=true

    export enum eAlign {
        //% block="linksbündig"
        left,
        //% block="rechtsbündig"
        right
    }

    //% group="Text" advanced=true
    //% block="format %pText || Länge %len %pAlign" weight=4
    //% len.min=1 len.max=20 len.defl=4
    export function format(pText: any, len?: number, pAlign?: eAlign) {
        let text: string = convertToText(pText)
        if (text.length > len)
            text = text.substr(0, len)
        else if (text.length < len && pAlign == eAlign.right)
            text = "                    ".substr(0, len - text.length) + text
        else if (text.length < len)
            text = text + "                    ".substr(0, len - text.length)
        return text
    }

    //% group="Text" advanced=true
    //% block="hex %a" weight=3
    export function hex(a: number[]) {
        return Buffer.fromArray(a).toHex()
    }

    //% group="Text" advanced=true
    //% block="bin %n || Länge %len" weight=2
    //% length.min=2 length.max=8 len.defl=2
    export function bin(n: number, len?: number) {
        let ht: string = ""
        let hi: number = Math.trunc(n)
        while (hi > 0) {
            ht = "01".charAt(hi % 2) + ht
            hi = hi >> 1
        }
        return ("00000000" + ht).substr(-len) // Anzahl Binärziffern von rechts
    }


    // ========== group="Kommentar"

    //% group="Kommentar" advanced=true
    //% block="// %text"
    export function comment(text: string): void { }

}