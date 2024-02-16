input.onButtonEvent(Button.A, 307, function () {
    if (car4.spursensor(car4.elr.links, car4.ehd.hell)) {
        basic.setLedColor(0x00ff00)
    } else {
        basic.setLedColor(0xff0000)
    }
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    control.raiseEvent(
    EventBusSource.MICROBIT_ID_BUTTON_A,
    EventBusValue.MICROBIT_EVT_ANY
    )
    car4.encoder_reset()
})
radio.onReceivedBuffer(function (Datenpaket) {
    car4.onReceivedBuffer(Datenpaket)
})
pins.onPulsed(DigitalPin.P2, PulseValue.Low, function () {
    basic.setLedColor(0xffff00)
})
control.onEvent(car4.encoder_EventSource(), EventBusValue.MICROBIT_EVT_ANY, function () {
    basic.setLedColor(0x007fff)
})
car4.beimStart(240, 90)
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 9, lcd20x4.lcd20x4_text("i2c-car4"))
