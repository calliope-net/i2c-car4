
namespace car4
/*
*/ { // programmieren.ts

    //let n_Programm = [Buffer.create(3), Buffer.create(3), Buffer.create(3), Buffer.create(3), Buffer.create(3), Buffer.create(3)]


    //% group="Programmieren" subcategory="Programmieren"
    //% block="Motor %motor Servo %servo Strecke %pStrecke cm" weight=7
    //% motor.shadow="speedPicker" servo.shadow="protractorPicker" servo.defl=90
    //% strecke.min=1 strecke.max=255 strecke.defl=20
    export function programmSchritt(motor: number, servo: number, strecke: number) {
        return Buffer.fromArray([
            Math.round(Math.map(motor, -100, 100, 0, 255)),
            Math.round(Math.map(servo, 0, 180, 31, 1)),
            strecke
        ])
    }
    //% group="Programmieren" subcategory="Programmieren"
    //% block="Buffer 3 Byte dez anzeigen %b" weight=6
    export function printBuffer(b: Buffer) {
        return b.getUint8(0).toString() + "°" + b.getUint8(1).toString() + "°" + b.getUint8(2).toString()
    }

    //% group="Programmieren" subcategory="Programmieren"
    //% block="Programm | Schritt 0 %p0 Schritt 1 %p1 Schritt 2 %p2 Schritt 3 %p Schritt 4 %p4 Schritt 5 %p5" weight=4
    export function programm6(p0: Buffer, p1: Buffer, p2: Buffer, p3: Buffer, p4: Buffer, p5: Buffer,) {
        let rBuffer = Buffer.create(19)

        if (p0) rBuffer.write(eBufferPointer.p0, p0.slice(0, 2)) // 1-2 (3 bleibt frei)
        if (p1) rBuffer.write(eBufferPointer.p1, p1) // 4-5-6
        if (p2) rBuffer.write(eBufferPointer.p2, p2)
        if (p3) rBuffer.write(eBufferPointer.p3, p3)
        if (p4) rBuffer.write(eBufferPointer.p4, p4)
        if (p5) rBuffer.write(eBufferPointer.p5, p5) // 16-17-18

        return rBuffer
        //n_sendBuffer19 = rBuffer
    }

    //% group="Programmieren" subcategory="Programmieren"
    //% block="fahre Strecke 1-5 aus Datenpaket" weight=4
    export function fahreBuffer19() {
        let lmotor: number, lservo: number, lstrecke: number
        for (let iBufferPointer: eBufferPointer = eBufferPointer.p1; iBufferPointer < 19; iBufferPointer += 3) { // 1, 4, 7, 10, 13, 16
            lmotor = receivedBuffer_getUint8(eBufferOffset.b0_Motor, iBufferPointer)
            lservo = receivedBuffer_getUint8(eBufferOffset.b1_Servo, iBufferPointer)
            lstrecke = receivedBuffer_getUint8(eBufferOffset.b2_Fahrstrecke, iBufferPointer)

            if (lmotor != c_MotorStop && lstrecke > 0) {
                encoder_start(lstrecke, true)
                servo_set(lservo)
                motorA255(lmotor)

                while (n_EncoderAutoStop) {
                    basic.pause(200) // Pause kann größer sein, weil Stop schon im Event erfolgt ist
                }
            }
        }
        //motorA255(128)
    }

    //% group="Programmieren" subcategory="Programmieren"
    //% block="Programm fahre Schritt %p0" weight=3
    export function fahreSchritt(p0: Buffer) {
        encoder_start(p0.getUint8(eBufferOffset.b2_Fahrstrecke))
        servo_set(((p0.getUint8(eBufferOffset.b1_Servo) & 0b00011111) + 14) * 3)
        motorA255(p0.getUint8(eBufferOffset.b0_Motor))

        //motorA255(128)
    }


} // programmieren.ts
