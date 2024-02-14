
namespace car4
/*
*/ { // wattmeter.ts

    // I²C Adresse Wattmeter Modul
    const i2cWattmeter = 0x45
    // Register
    enum eRegister {
        REG_CONFIG = 0x00,          // Config register
        REG_SHUNTVOLTAGE = 0x01,    // Shunt Voltage Register
        REG_BUSVOLTAGE = 0x02,      // Bus Voltage Register
        REG_POWER = 0x03,           // Power Register
        REG_CURRENT = 0x04,         // Current Register
        REG_CALIBRATION = 0x05      // Register Calibration
    }

    //% group="Wattmeter"
    //% block="Wattmeter Reset || Calibration %calibration_value"
    //% calibration_value.defl=4096
    export function wattmeterReset(calibration_value?: number): boolean {
        //n_i2cCheck = (ck ? true : false) // optionaler boolean Parameter kann undefined sein
        //n_i2cError = 0 // Reset Fehlercode

        //write_register(pADDR, eRegister.REG_CONFIG, INA219_CONFIG_RESET) // 0x8000
        //writeCONFIGURATION(pADDR, 0x8000)
        //writeCALIBRATION(pADDR, calibration_value)

        if (write_register(eRegister.REG_CONFIG, 0x8000) == 0) // INA219_CONFIG_RESET
            return write_register(eRegister.REG_CALIBRATION, calibration_value) == 0
        else
            return false
    }



    //% group="Wattmeter"
    //% block="Wattmeter Spannung U in V" weight=8
    export function get_bus_voltage_V()  { // get the BusVoltage （Voltage of IN- to GND)
        // die letzten 3 Bit 2-1-0 gehögen nicht zum Messwert | - | CNVR | OVF
        //return (read_Register_UInt16BE(pADDR, eRegister.REG_BUSVOLTAGE) >> 3) * 0.004    // cpp  0.004/8=0.0005
        return (read_register(eRegister.REG_BUSVOLTAGE).getNumber(NumberFormat.UInt16BE, 0) >> 3) * 0.004    // cpp  0.004/8=0.0005
    }

    

    function read_register(register: eRegister): Buffer { // return: Buffer
        pins.i2cWriteBuffer(i2cWattmeter, Buffer.fromArray([register]), true)
        return pins.i2cReadBuffer(i2cWattmeter, 2)
    }

    function write_register(register: eRegister, value: number) { // value: uint16_t
        let bu = Buffer.create(3)
        bu.setUint8(0, register)
        bu.setNumber(NumberFormat.UInt16BE, 1, value)
        return pins.i2cWriteBuffer(i2cWattmeter, bu)
    }

} // wattmeter.ts
