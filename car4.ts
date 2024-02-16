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

    let n_Simulator: boolean = ("€".charCodeAt(0) == 8364)
    let n_Log = "CaR4" // Anzeige auf Display nach Start
    let n_Servo_geradeaus = 90 // Winkel für geradeaus wird beim Start eingestellt
    let n_ServoWinkel = 90 // aktuell eingestellter Winkel

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
    //% block="CaR4 beim Start Funkgruppe %funkgruppe Servo ↑ %winkel °" weight=8
    //% funkgruppe.min=0 funkgruppe.max=255 funkgruppe.defl=240
    //% winkel.min=81 winkel.max=99 winkel.defl=90
    //% inlineInputMode=inline 
    export function beimStart(funkgruppe: number, winkel: number) {
        let tx: string

        // Parameter
        radio.setGroup(funkgruppe)
        n_Servo_geradeaus = winkel

        relay(true) // Relais an schalten (PIN 0)


        // I²C Module initialisieren und Fehler anzeigen
        if (!n_Simulator) {
            if (!wattmeterReset(4096)) {
                tx = Buffer.fromArray([i2cWattmeter]).toHex()
                n_Log += " " + tx
                basic.showString(tx) // zeige fehlerhafte i2c-Adresse als HEX
            } else if (wattmeterakkuleer()) {
                n_Log += " Akku laden"
            }

            if (!motorReset()) {
                tx = Buffer.fromArray([i2cMotor]).toHex()
                n_Log += " " + tx
                basic.showString(tx) // zeige fehlerhafte i2c-Adresse als HEX
            }
        }

        // PINs ab PIN 4:
        led.enable(false) // Matrix deaktivieren (erst nach showString), um PINs zu benutzen
        servo(n_Servo_geradeaus) // Servo PIN PWM
        pins.setPull(pinEncoder, PinPullMode.PullUp) // Encoder PIN Eingang PullUp

        // in bluetooth.ts:
        bluetooth_beimStart()
      

    }

    //% group="beim Start"
    //% block="Protokoll Text" weight=4
    export function logText() { return n_Log }



    // ========== group="Servo"

    //% group="Servo"
    //% block="Servo (45° ↖ 90° ↗ 135°) %winkel °"
    //% winkel.min=45 winkel.max=135 winkel.defl=90
    export function servo(winkel: number) {
        if (between(winkel, 45, 135) && n_ServoWinkel != winkel) {
            n_ServoWinkel = winkel
            pins.servoWritePin(pinServo, winkel + n_Servo_geradeaus - 90)
        }
    }



    // ========== group="Kommentar"

    //% group="Kommentar"
    //% block="// %text"
    export function comment(text: string): void { }



    // ========== group="Logik" advanced=true

    //% group="Logik" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=1
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }

}