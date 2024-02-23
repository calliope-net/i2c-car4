
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
    //% block="Programm fahre receivedBuffer19" weight=4
    export function fahreBuffer19() {
        //let motor: number, strecke: number
        for (let iBufferPointer: eBufferPointer = eBufferPointer.p0; iBufferPointer < 19; iBufferPointer += 3) { // 1, 4, 7, 10, 13, 16
            // motor = receivedBuffer_getUint8(eBufferOffset.b0_Motor,iBufferPointer)
            //servo = receivedBuffer_getUint8(eBufferOffset.b1_Servo,iBufferPointer)
            //strecke = receivedBuffer_getUint8(eBufferOffset.b2_Fahrstrecke,iBufferPointer)

            encoder_reset(receivedBuffer_getUint8(eBufferOffset.b2_Fahrstrecke, iBufferPointer))
            servo(receivedBuffer_getUint8(eBufferOffset.b1_Servo, iBufferPointer))
            motorA255(receivedBuffer_getUint8(eBufferOffset.b0_Motor, iBufferPointer))

            wartebis(n_EncoderEvent)

        }
        motorA255(128)
    }

    //% group="Programmieren" subcategory="Programmieren"
    //% block="Programm fahre Schritt %p0" weight=3
    export function fahreSchritt(p0: Buffer) {
        encoder_reset(p0.getUint8(eBufferOffset.b2_Fahrstrecke))
        servo(((p0.getUint8(eBufferOffset.b1_Servo) & 0b00011111) + 14) * 3)
        motorA255(p0.getUint8(eBufferOffset.b0_Motor))

        /* while (!n_EncoderEvent) {
            basic.pause(2)
        } */

        /*  while (!(encoder_get(eEncoderEinheit.cm) > 20)) {
             basic.pause(2)
         } */
     
        //motorA255(128)
    }


   

} // programmieren.ts
