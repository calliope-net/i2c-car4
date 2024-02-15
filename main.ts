input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (car4.spursensor(car4.elr.links, car4.ehd.dunkel)) {
        basic.setLedColor(0x00ff00)
    } else {
        basic.setLedColor(0xff0000)
    }
})
radio.onReceivedBuffer(function (Datenpaket) {
    car4.onReceivedBuffer(Datenpaket)
})
car4.beimStart(240, 90)
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 9, lcd20x4.lcd20x4_text("i2c-car4"))
