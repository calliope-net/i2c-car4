
namespace car4
/*
*/ { // sensoren.ts



    // adapted to Calliope mini V2 Core by M.Klein 17.09.2020
    /**
     * Create a new driver of Grove - Ultrasonic Sensor to measure distances in cm
     * @param pin signal pin of ultrasonic ranger module
     */
    //% group="Ultraschall" subcategory="Sensoren" 
    //% block="Entfernung (cm)"
    export function entfernung(): number {
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


    export enum eVergleich {
        //% block=">"
        gt,
        //% block="<"
        lt
    }
    //% group="Ultraschall" subcategory="Sensoren"
    //% block="Entfernung %pVergleich %cm cm" weight=2
    //% cm.min=1 cm.max=50 cm.defl=15
    export function bitINPUT_US(pVergleich: eVergleich, cm: number) {
        switch (pVergleich) {
            case eVergleich.gt: return entfernung() > cm
            case eVergleich.lt: return entfernung() < cm
            default: return false
        }
    }


} // sensoren.ts
