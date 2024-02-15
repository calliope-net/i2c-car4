
namespace car4
/*
*/ { // sensoren.ts

    // ========== Encoder ==========

    let n_Encoder: number = 0
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm

    pins.onPulsed(pinEncoder, PulseValue.Low, function () {
        //bit.comment("Encoder 63.3 Impulse pro U/Motorwelle")
        if (n_Motor >= 128) {
            n_Encoder += 1
        } else {
            n_Encoder -= 1
        }
        //bit.comment("63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502cm || Test: 946 Impulse = 200 cm")
        //if (iFahrstrecke != 0 && Math.abs(iEncoder) >= iFahrstrecke * 4.73) {
        //    MotorSteuerung(128, 0)
        //}
    })

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder cm"
    export function encoder_cm() {
        // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
        // Test: 946 Impulse = 200 cm
        return n_Encoder / n_EncoderFaktor
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder lesen"
    export function encoder_get() { return n_Encoder }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Reset Encoder"
    export function encoder_reset() { n_Encoder = 0 }



    // ========== Spursensor ==========

    let n_Spur_rechts: boolean = true
    let n_Spur_links: boolean = true

    pins.onPulsed(pinSpurlinks, PulseValue.High, function () { n_Spur_links = true }) // 1 weiß
    pins.onPulsed(pinSpurlinks, PulseValue.Low, function () { n_Spur_links = false }) // 0 schwarz
    pins.onPulsed(pinSpurrechts, PulseValue.High, function () { n_Spur_links = true })
    pins.onPulsed(pinSpurrechts, PulseValue.Low, function () { n_Spur_links = false })


    //% group="Spursensor" subcategory="Sensoren"
    //% block="Spursensor %plr %phd"
    export function spursensor(plr: elr, phd: ehd) {
        if (plr == elr.links)
            return n_Spur_links !== (phd == ehd.dunkel)
        else if (plr == elr.rechts)
            return n_Spur_rechts !== (phd == ehd.dunkel)
        else
            return false
    }


    // ========== Ultraschall ==========

    // adapted to Calliope mini V2 Core by M.Klein 17.09.2020
    /**
     * Create a new driver of Grove - Ultrasonic Sensor to measure distances in cm
     * @param pin signal pin of ultrasonic ranger module
     */
    //% group="Ultraschall" subcategory="Sensoren" 
    //% block="Entfernung (cm)"
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

    //% group="Ultraschall" subcategory="Sensoren"
    //% block="Entfernung %pVergleich %cm cm" weight=2
    //% cm.min=1 cm.max=50 cm.defl=15
    export function entfernung_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return entfernung_cm() > cm
            case eVergleich.lt: return entfernung_cm() < cm
            default: return false
        }
    }



    //% group="Helligkeit" subcategory="Sensoren"
    //% block="Helligkeit"
    export function helligkeit() { return pins.analogReadPin(pinFototransistor) }

    //% group="Helligkeit" subcategory="Sensoren"
    //% block="Helligkeit %pVergleich %analog"
    export function helligkeit_vergleich(pVergleich: eVergleich, analog: number) {
        switch (pVergleich) {
            case eVergleich.gt: return helligkeit() > analog
            case eVergleich.lt: return helligkeit() < analog
            default: return false
        }
    }




    export enum eVergleich {
        //% block=">"
        gt,
        //% block="<"
        lt
    }
    export enum elr { links, rechts }
    export enum ehd { hell, dunkel }

} // sensoren.ts
