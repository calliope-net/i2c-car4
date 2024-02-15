
namespace car4
/*
*/ { // sensoren.ts



    // ========== group="Encoder" subcategory="Sensoren"

    let n_Encoder: number = 0
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm

    // Event Handler
    pins.onPulsed(pinEncoder, PulseValue.Low, function () {
        // Encoder 63.3 Impulse pro U/Motorwelle
        if (n_Motor >= 128) n_Encoder += 1 // vorwärts
        else n_Encoder -= 1 // rückwärts
    })




    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder cm" weight=6
    export function encoder_cm() {
        // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
        // Test: 946 Impulse = 200 cm
        return n_Encoder / n_EncoderFaktor
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder Impulse" weight=4
    export function encoder_get() { return n_Encoder }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder Reset" weight=2
    export function encoder_reset() { n_Encoder = 0 }



    // ========== group="Spursensor" subcategory="Sensoren"

    let n_Spur_rechts: boolean
    let n_Spur_links: boolean

    pins.onPulsed(pinSpurlinks, PulseValue.High, function () { n_Spur_links = true }) // 1 weiß
    pins.onPulsed(pinSpurlinks, PulseValue.Low, function () { n_Spur_links = false }) // 0 schwarz
    pins.onPulsed(pinSpurrechts, PulseValue.High, function () { n_Spur_links = true })
    pins.onPulsed(pinSpurrechts, PulseValue.Low, function () { n_Spur_links = false })

    //% group="Spursensor" subcategory="Sensoren"
    //% block="Spursensor %plr %phd"
    export function spursensor(plr: elr, phd: ehd) {
        switch (plr) {
            case elr.links: return n_Spur_links !== (phd == ehd.dunkel) // !== XOR (eine Seite ist true aber nicht beide)
            case elr.rechts: return n_Spur_rechts !== (phd == ehd.dunkel)
            default: return false
        }
        /*  if (plr == elr.links)
             return n_Spur_links !== (phd == ehd.dunkel) // !== XOR (eine Seite ist true aber nicht beide)
         else if (plr == elr.rechts)
             return n_Spur_rechts !== (phd == ehd.dunkel)
         else
             return false */
    }



    // ========== group="Ultraschall" subcategory="Sensoren"

    //% group="Ultraschall" subcategory="Sensoren"
    //% block="Entfernung %pVergleich %cm cm" weight=6
    //% cm.min=1 cm.max=50 cm.defl=15
    export function entfernung_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return entfernung_cm() > cm
            case eVergleich.lt: return entfernung_cm() < cm
            default: return false
        }
    }

    // adapted to Calliope mini V2 Core by M.Klein 17.09.2020
    /**
     * Create a new driver of Grove - Ultrasonic Sensor to measure distances in cm
     * @param pin signal pin of ultrasonic ranger module
     */
    //% group="Ultraschall" subcategory="Sensoren"
    //% block="Entfernung (cm)" weight=4
    export function entfernung_cm(): number {
        pins.digitalWritePin(pinUltraschall, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pinUltraschall, 1);
        control.waitMicros(20);
        pins.digitalWritePin(pinUltraschall, 0);

        return pins.pulseIn(pinUltraschall, PulseValue.High, 50000) * 0.0263793

        //duration = pins.pulseIn(pin, PulseValue.High, 50000); // Max duration 50 ms

        //RangeInCentimeters = duration * 153 / 29 / 2 / 100; // 0.0263793

        //if (RangeInCentimeters > 0) distanceBackup = RangeInCentimeters;
        //else RangeInCentimeters = distanceBackup;

        //basic.pause(50);

        //return RangeInCentimeters;
    }



    // ========== group="Helligkeit" subcategory="Sensoren"

    //% group="Helligkeit" subcategory="Sensoren"
    //% block="Helligkeit %pVergleich %analog" weight=8
    export function helligkeit_vergleich(pVergleich: eVergleich, analog: number) {
        switch (pVergleich) {
            case eVergleich.gt: return helligkeit_analog() > analog
            case eVergleich.lt: return helligkeit_analog() < analog
            default: return false
        }
    }

    //% group="Helligkeit" subcategory="Sensoren"
    //% block="Helligkeit analog" weight=6
    export function helligkeit_analog() { return pins.analogReadPin(pinFototransistor) }



    // ========== enums

    export enum eVergleich {
        //% block=">"
        gt,
        //% block="<"
        lt
    }
    export enum elr { links, rechts }
    export enum ehd { hell, dunkel }

} // sensoren.ts
