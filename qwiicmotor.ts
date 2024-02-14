// Gib deinen Code hier ein
namespace car4
/*
*/ { // qwiicmotor.ts
    const i2cMotor = qwiicmotor.eADDR.Motor_x5D
    const DRIVER_ENABLE = 0x70 //  0x01: Enable, 0x00: Disable this driver
    const MA_DRIVE = 0x20 // 0x00..0xFF Default 0x80
    const MB_DRIVE = 0x21

    //% group="Motor"
    //% block="Motor Power %pON" weight=4
    export function driver_enable(pON: boolean): boolean {
        return pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([DRIVER_ENABLE, pON ? 0x01 : 0x00])) == 0
    }
    /*  function writeRegister(pADDR: number, pRegister: number, value: number) {
         let bu = Buffer.create(2)
         bu.setUint8(0, pRegister)
         bu.setUint8(1, value)
         i2cWriteBuffer(pADDR, bu)
     } */
} // qwiicmotor.ts