//% color="#ED755E"
namespace Fuzzyiot {
    let flag = true;

    //% blockId=mbit_ultrasonic block="Distancia do senosr ultrasonico(cm)"
    //% weight=98
    //% blockGap=10
    export function Ultrasonic_Car(): number {

        // send pulse
        let list: Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
            pins.digitalWritePin(DigitalPin.P14, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P14, 1);
            control.waitMicros(15);
            pins.digitalWritePin(DigitalPin.P14, 0);

            let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
            list[i] = Math.floor(d / 40)
        }
        list.sort();
        let length = (list[1] + list[2] + list[3]) / 3;
        return Math.floor(length);
    }
}