
namespace car4
/*
*/ { // qwiicmotor.ts

    // I²C Adresse Motor Modul
    export const i2cMotor = 0x5D
    // Register
    const MA_DRIVE = 0x20 // 0x00..0xFF Default 0x80
    //const MB_DRIVE = 0x21
    const DRIVER_ENABLE = 0x70 //  0x01: Enable, 0x00: Disable this driver
    const FSAFE_CTRL = 0x1F // Use to configure what happens when failsafe occurs.
    const FSAFE_TIME = 0x76 // This register sets the watchdog timeout time, from 10 ms to 2.55 seconds.
    const STATUS_1 = 0x77 // This register uses bits to show status. Currently, only b0 is used.
    const CONTROL_1 = 0x78 // 0x01: Reset the processor now.

    let n_MotorA = 128



    //% group="Motor"
    //% block="Motor Reset" weight=9
    export function motorReset() {
        return pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([CONTROL_1, 1])) == 0 // Reset the processor now.
    }

    //% group="Motor"
    //% block="Motor Status %pStatus" weight=8
    export function motorStatus(): boolean {
        /*
        bool ready( void );
        This function checks to see if the SCMD is done booting and is ready to receive commands. Use this
        after .begin(), and don't progress to your main program until this returns true.
        SCMD_STATUS_1: Read back basic program status
            B0: 1 = Enumeration Complete
            B1: 1 = Device busy
            B2: 1 = Remote read in progress
            B3: 1 = Remote write in progress
            B4: Read state of enable pin U2.5"
        */
        //control.waitMicros(2000000) // 2 s lange Wartezeit
        pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([STATUS_1]), true)
        let statusByte = pins.i2cReadBuffer(i2cMotor, 1).getUint8(0)
        //let statusByte = readBuffer2(pADDR, STATUS_1).getUint8(0)
        //n_i2cError = 0 // Fehler ignorieren, kann passieren wenn Zeit zu kurz
        return (statusByte & 0x01) != 0 && statusByte != 0xFF  // wait for ready flag and not 0xFF
    }


    //% group="Motor"
    //% block="Motor Power %pON" weight=7
    //% pON.shadow="toggleOnOff"
    export function motorON(pON: boolean) {
        pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([DRIVER_ENABLE, pON ? 0x01 : 0x00]))
    }

    //% group="Motor"
    //% block="Motor A (-100 ↓ 0 ↑ 100) %speed \\%" weight=6
    //% speed.shadow="speedPicker" speed.defl=0
    export function motorA100(speed: number) {
        // constrain: speed zwischen -100 und +100 begrenzen
        // map: -100 -> 0 / 0 -> 127,5 / +100 -> 255
        // ceil: aufrunden, damit 127,5 = 128 = 0x80 Motor Stillstand
        //let driveValue = Math.ceil(Math.map(Math.constrain(speed, -100, 100), -100, 100, 0, 255))
        motorA255(Math.ceil(Math.map(Math.constrain(speed, -100, 100), -100, 100, 0, 255)))
        //writeRegister(pADDR, eRegister.MA_DRIVE, driveValue & 0xFF)
    }

    //% group="Motor"
    //% block="Motor A (0 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=4
    //% speed.min=0 speed.max=255 speed.defl=128
    export function motorA255(speed: number) {
        if (between(speed, 0, 255) && speed != n_MotorA) {
            n_MotorA = speed
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([MA_DRIVE, n_MotorA]))
        }
    }

    //% group="Motor"
    //% block="Motor A (0 ↓ 128 ↑ 255)" weight=3
    export function motorAget() { return n_MotorA }

    //% group="Motor"
    //% block="watchdog timeout %time * 10ms" weight=2
    //% time.min=0 time.max=255 time.defl=0
    export function setSafeTime(time: number) {
        if (between(time, 0, 255))
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([FSAFE_CTRL, 0x01])) // 1 -- Center output drive levels for 0 drive
        pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([FSAFE_TIME, time])) // 0x76 0 ... 2,55 Sekunden
    }

} // qwiicmotor.ts