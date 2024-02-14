radio.onReceivedBuffer(function (receivedNumber) {
    car4.onReceivedBuffer(receivedNumber)
})
car4.beimStart(240, 90)
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 9, lcd20x4.lcd20x4_text("i2c-car4"))
