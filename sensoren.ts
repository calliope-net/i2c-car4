
namespace car4
/*
*/ { // sensoren.ts



    // ========== group="Encoder" subcategory="Sensoren"

    let n_EncoderCounter: number = 0 // Impuls Zähler
    let n_EncoderFaktor = 63.3 * (26 / 14) / (8 * Math.PI) // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
    //let n_EncoderStrecke_cm: number = 0 // löst Event aus bei Zähler in cm
    let n_EncoderStrecke_impulse: number = 0
    export let n_EncoderEvent = false

    // Event Handler
    pins.onPulsed(pinEncoder, PulseValue.Low, function () {
        // Encoder 63.3 Impulse pro U/Motorwelle
        if (motorAget() >= 128) n_EncoderCounter += 1 // vorwärts
        else n_EncoderCounter -= 1 // rückwärts

        if (n_EncoderStrecke_impulse > 0 && Math.abs(n_EncoderCounter) >= n_EncoderStrecke_impulse) {
            n_EncoderStrecke_impulse = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_reset

            n_EncoderEvent = true

            if (onEncoderStopHandler)
                onEncoderStopHandler(n_EncoderCounter / n_EncoderFaktor)
        }

        /* if (n_EncoderStrecke_cm > 0 && Math.abs(encoder_get(eEncoderEinheit.cm)) >= n_EncoderStrecke_cm) {
            n_EncoderStrecke_cm = 0 // Ereignis nur einmalig auslösen, wieder aktivieren mit encoder_reset
            n_EncoderEvent = true
            //control.raiseEvent(encoder_EventSource(), EventBusValue.MICROBIT_EVT_ANY)

            if (onEncoderStopHandler)
                onEncoderStopHandler(n_EncoderStrecke_cm)
        } */
    })

    let onEncoderStopHandler: (v: number) => void

    //% block="wenn Ziel erreicht" subcategory="Sensoren"
    //% draggableParameters=reporter
    export function onEncoderStop(cb: (v: number) => void) {
        onEncoderStopHandler = cb
    }



    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder Reset || Ereignis auslösen bei %strecke cm" weight=9
    //% strecke.min=1 strecke.max=255 strecke.defl=20
    export function encoder_reset(streckecm = 0) {
        n_EncoderCounter = 0 // Impuls Zähler zurück setzen

        /* if (streckecm > 0) n_EncoderStrecke_cm = streckecm
        else n_EncoderStrecke_cm = 0 */

        if (streckecm > 0) n_EncoderStrecke_impulse = Math.round(streckecm * n_EncoderFaktor)
        else n_EncoderStrecke_impulse = 0

        n_EncoderEvent = false
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder Ereignis Quelle" weight=8
    //export function encoder_EventSource() { return 16022 }




    //% group="Encoder" subcategory="Sensoren"
    //% block="Fahrstrecke %pVergleich %cm cm" weight=7
    export function encoder_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return encoder_get(eEncoderEinheit.cm) >= cm
            case eVergleich.lt: return encoder_get(eEncoderEinheit.cm) <= cm
            default: return false
        }
    }

    //% group="Encoder" subcategory="Sensoren"
    //% block="warte bis Strecke %pVergleich %cm cm || Pause %ms ms" weight=6
    //% cm.defl=15 ms.defl=20
    export function encoder_warten(pVergleich: eVergleich, cm: number, ms?: number) {
        while (encoder_vergleich(pVergleich, cm)) {
            basic.pause(ms)
        }
    }


    //% group="warten" subcategory="Sensoren"
    //% block="warte bis %bedingung || Pause %ms ms" weight=2
    //% ms.defl=20
    /* export function wartebis(bedingung: boolean, ms?: number) {
        while (!bedingung) {
            basic.pause(ms)
        }
    } */



    //% group="Encoder" subcategory="Sensoren"
    //% block="Encoder %pEncoderEinheit" weight=4
    export function encoder_get(pEncoderEinheit: eEncoderEinheit) {
        if (pEncoderEinheit == eEncoderEinheit.cm)
            // 63.3 Motorwelle * (26/14) Zahnräder / (8cm * PI) Rad Umfang = 4.6774502 cm
            // Test: 946 Impulse = 200 cm
            return Math.round(n_EncoderCounter / n_EncoderFaktor)
        else
            return n_EncoderCounter
    }


    // ========== group="Spursensor" subcategory="Sensoren"
    /*
    let n_Spur_rechts: boolean
    let n_Spur_links: boolean
 
        pins.onPulsed(pinSpurlinks, PulseValue.High, function () { n_Spur_links = true }) // 1 weiß
        pins.onPulsed(pinSpurlinks, PulseValue.Low, function () { n_Spur_links = false }) // 0 schwarz
        pins.onPulsed(pinSpurrechts, PulseValue.High, function () { n_Spur_links = true })
        pins.onPulsed(pinSpurrechts, PulseValue.Low, function () { n_Spur_links = false })
     */
    //% group="Spursensor" subcategory="Sensoren"
    //% block="Spursensor %plr %phd" weight=4
    export function spursensor(plr: elr, phd: ehd) {
        switch (plr) {
            case elr.links: return (pins.digitalReadPin(pinSpurlinks) == 1) !== (phd == ehd.dunkel) // !== XOR (eine Seite ist true aber nicht beide)
            case elr.rechts: return (pins.digitalReadPin(pinSpurrechts) == 1) !== (phd == ehd.dunkel)
            default: return false
        }
    }

    //% group="Spursensor" subcategory="Sensoren"
    //% block="Spursensor 00 01 10 11" weight=2
    export function spursensor_get() {
        //return (n_Spur_links ? 2 : 0) + (n_Spur_rechts ? 1 : 0)
        return pins.digitalReadPin(pinSpurlinks) * 2 + pins.digitalReadPin(pinSpurrechts)
    }



    // ========== group="Ultraschall" subcategory="Sensoren"

    //% group="Ultraschall" subcategory="Sensoren"
    //% block="Entfernung %pVergleich %cm cm" weight=6
    //% cm.min=1 cm.max=50 cm.defl=15
    export function entfernung_vergleich(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return entfernung_cm() >= cm
            case eVergleich.lt: return entfernung_cm() <= cm
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

        return Math.round(pins.pulseIn(pinUltraschall, PulseValue.High, 50000) * 0.0263793)

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
            case eVergleich.gt: return helligkeit_analog() >= analog
            case eVergleich.lt: return helligkeit_analog() <= analog
            default: return false
        }
    }

    //% group="Helligkeit" subcategory="Sensoren"
    //% block="Helligkeit analog" weight=6
    export function helligkeit_analog() { return pins.analogReadPin(pinFototransistor) }



    // ========== group="warten" subcategory="Sensoren"

    //% group="warten" subcategory="Sensoren"
    //% block="warte bis %bedingung || Pause %ms ms" weight=2
    //% ms.defl=20
    /* export function wartebis(bedingung: boolean, ms?: number) {
        while (!bedingung) {
            basic.pause(ms)
        }
    } */

    //% group="warten" subcategory="Sensoren"
    //% block="warte %sekunden Sekunden" weight=1
    //% sekunden.shadow=car4_ePause
    export function pauseSekunden(sekunden: number) { basic.pause(sekunden * 1000) }



    // ========== enums

    export enum ePause {
        //% block="0.5"
        p05 = 5,
        //% block="1"
        p1 = 10,
        //% block="2"
        p2 = 20,
        //% block="3"
        p3 = 30,
        //% block="4"
        p4 = 40,
        //% block="5"
        p5 = 50,
        //% block="10"
        p10 = 100,
        //% block="15"
        p15 = 150,
        //% block="20"
        p20 = 200,
        //% block="30"
        p30 = 300,
        //% block="45"
        p45 = 450,
        //% block="60"
        p60 = 600
    }
    //% blockId=car4_ePause block="%pPause" blockHidden=true
    export function car4_ePause(pPause: ePause): number { return pPause / 10 }

    export enum eVergleich {
        //% block=">="
        gt,
        //% block="<="
        lt
    }
    export enum eEncoderEinheit { cm, Impulse }
    export enum elr { links, rechts }
    export enum ehd {
        //% block="0 dunkel"
        dunkel,
        //% block="1 hell"
        hell
    }

} // sensoren.ts
