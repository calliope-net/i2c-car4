//% color=#007F00 icon="\uf188" block="CaR 4" weight=28
namespace car4
/* 240213 calliope-net.github.io/car4

 */ {


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
        pins.digitalWritePin(DigitalPin.P0, 1)

        lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
        lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 9, lcd20x4.lcd20x4_text(""))

        qwiicmotor.init(qwiicmotor.qwiicmotor_eADDR(qwiicmotor.eADDR.Motor_x5D))

        wattmeter.reset(wattmeter.wattmeter_eADDR(wattmeter.eADDR.Watt_x45))



        radio.setGroup(240)
        led.enable(false)
        pins.servoWritePin(AnalogPin.C4, 96)
        pins.setPull(DigitalPin.P2, PinPullMode.PullUp)

    }

}