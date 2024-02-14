// Gib deinen Code hier ein
namespace car4
/*
*/ { // qwiicmotor.ts

    // I²C Adresse Motor Modul
    const i2cMotor = 0x5D
    // Register
    const MA_DRIVE = 0x20 // 0x00..0xFF Default 0x80
    //const MB_DRIVE = 0x21
    const DRIVER_ENABLE = 0x70 //  0x01: Enable, 0x00: Disable this driver
    const FSAFE_CTRL = 0x1F // Use to configure what happens when failsafe occurs.
    const FSAFE_TIME = 0x76 // This register sets the watchdog timeout time, from 10 ms to 2.55 seconds.

    //% group="Motor"
    //% block="Motor Power %pON" weight=8
    //% pON.shadow="toggleOnOff"
    export function motorON(pON: boolean): boolean {
        return pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([DRIVER_ENABLE, pON ? 0x01 : 0x00])) == 0
    }


    //% group="Motor"
    //% block="Motor A (-100 ← 0 → 100) %speed \\%" weight=6
    //% speed.shadow="speedPicker" speed.defl=0
    export function motorA(speed: number) {
        // constrain: speed zwischen -100 und +100 begrenzen
        // map: -100 -> 0 / 0 -> 127,5 / +100 -> 255
        // ceil: aufrunden, damit 127,5 = 128 = 0x80 Motor Stillstand
        //let driveValue = Math.ceil(Math.map(Math.constrain(speed, -100, 100), -100, 100, 0, 255))
        motorA255(Math.ceil(Math.map(Math.constrain(speed, -100, 100), -100, 100, 0, 255)))
        //writeRegister(pADDR, eRegister.MA_DRIVE, driveValue & 0xFF)
    }

    //% group="Motor"
    //% block="Motor A (0 ← 128 → 255) %speed (128 ist STOP)" weight=4
    //% speed.min=0 speed.max=255 speed.defl=128
    export function motorA255(speed: number) {
        if (between(speed, 0, 255))
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([MA_DRIVE, speed]))
        else
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([MA_DRIVE, 128]))
    }

    //% group="Motor"
    //% block="watchdog timeout %time * 10ms" weight=2
    //% time.min=0 time.max=255 time.defl=0
    export function setSafeTime(time: number) {
       
        if (between(time, 0, 255))
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([FSAFE_CTRL, 0x01])) // 1 -- Center output drive levels for 0 drive
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([FSAFE_TIME, time])) // 0x76 0 ... 2,55 Sekunden
    }

} // qwiicmotor.ts