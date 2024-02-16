radio.onReceivedBuffer(function (Datenpaket) {
    car4.onReceivedBuffer(Datenpaket)
})
control.onEvent(car4.encoder_EventSource(), EventBusValue.MICROBIT_EVT_ANY, function () {
    basic.setLedColor(0x007fff)
})
car4.beimStart(240, 90)
