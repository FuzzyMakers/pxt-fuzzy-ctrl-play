//% color="#ED755E"
namespace Fuzzy_sensor {
    let flag = true;

    //% blockId=mbit_ultrasonic block="Distancia do sensor ultrasonico(cm)"
    //% weight=98
    //% blockGap=10
    export function Ultrasonic_Car(): number {

        // send pulse
        
            pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
            pins.digitalWritePin(DigitalPin.P14, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P14, 1);
            control.waitMicros(15);
            pins.digitalWritePin(DigitalPin.P14, 0);
            let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
        return  Math.floor(d / 40);
    }
}
