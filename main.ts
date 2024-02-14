input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    car4.sendBuffer()
})
radio.onReceivedBuffer(function (receivedBuffer) {
    car4.onReceivedBuffer(receivedBuffer)
})
