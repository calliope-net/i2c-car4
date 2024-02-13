//% color=#007F00 icon="\uf188" block="CaR 4" weight=28
namespace car4
/* 240213 calliope-net.github.io/car4

 */ {
    const pinRelay = DigitalPin.P0          // 5V Grove Relay
    const pinFototransistor = AnalogPin.P1  // GND fischertechnik 36134 Fototransistor
    const pinEncoder = DigitalPin.P2        // 5V fischertechnik 186175 Encodermotor Competition
    const pinBuzzer = DigitalPin.P3         // 5V Grove Buzzer
    const pinServo = AnalogPin.C4           // 5V fischertechnik 132292 Servo
    const pin5 = DigitalPin.C5              // Draht blau
    const pin6 = DigitalPin.C6              // Draht gelb
    const pinLicht = DigitalPin.C7          // 5V Licht
    const pinUltraschall = DigitalPin.C8    // 5V Grove Ultrasonic
    const pinSpurrechts = DigitalPin.C9     // 9V fischertechnik 128598 IR-Spursensor
    //const pin10 = DigitalPin.C10
    const pinSpurlinks = DigitalPin.C11     // 9V fischertechnik 128598 IR-Spursensor

    const i2cLCD20x4 = lcd20x4.eADDR.LCD_20x4
    const i2cMotor = qwiicmotor.eADDR.Motor_x5D
    const i2cWattmeter = wattmeter.eADDR.Watt_x45

    // ========== group="beim Start"

    //% group="beim Start"
    //% block="CaR4 beim Start Text %pText || i2c-Check %ck"
    // pADDR.shadow="calli2bot_eADDR"
    //% ck.shadow="toggleOnOff" ck.defl=1
    // pLogEnabled.shadow="toggleOnOff"
    // blockSetVariable=Calli2bot
    export function beimStart(pText: string, ck = true) {
        /*   let c2 = new Calli2bot(pADDR, (ck ? true : false), pLogEnabled) // optionaler boolean Parameter kann undefined sein
          calliBot2.c2Initialized = 1
          calliBot2.c2IsBot2 = 1
           */
        pins.digitalWritePin(pinRelay, 1)

        lcd20x4.initLCD(i2cLCD20x4, false, ck)
        lcd20x4.writeText(i2cLCD20x4, 0, 0, 9, pText)

        qwiicmotor.init(i2cMotor, ck)

        wattmeter.reset(i2cWattmeter, 4096, ck)



        radio.setGroup(240)
        led.enable(false)
        pins.servoWritePin(pinServo, 96)
        pins.setPull(pinEncoder, PinPullMode.PullUp)

    }



    // adapted to Calliope mini V2 Core by M.Klein 17.09.2020
    /**
     * Create a new driver of Grove - Ultrasonic Sensor to measure distances in cm
     * @param pin signal pin of ultrasonic ranger module
     */
    //% group="Ultraschall" advanced=true
    //% block="%pin Entfernung (cm)"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips="false" pin.fieldOptions.width="250"
    //% pin.defl=DigitalPin.C16

    export function measureInCentimeters(pin: DigitalPin): number {
        //let duration = 0;
        //let RangeInCentimeters = 0;

        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(20);
        pins.digitalWritePin(pin, 0);

        return pins.pulseIn(pin, PulseValue.High, 50000) * 0.0263793

        //duration = pins.pulseIn(pin, PulseValue.High, 50000); // Max duration 50 ms

        //RangeInCentimeters = duration * 153 / 29 / 2 / 100; // 0.0263793

        //if (RangeInCentimeters > 0) distanceBackup = RangeInCentimeters;
        //else RangeInCentimeters = distanceBackup;

        //basic.pause(50);

        //return RangeInCentimeters;
    }

}