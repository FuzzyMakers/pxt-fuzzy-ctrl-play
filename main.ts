
//% color="#ED755E" icon="\f518"
namespace Fuzzy_sensor {

    export enum Distance_Unit {
        //% block="ms" enumval=0
        Distance_Unit_ms,
        //% block="cm" enumval=1
        Distance_Unit_cm,
    }

    export enum DHT11Type {
        //% block="temperatura(℃)" enumval=0
        DHT11_temperature_C,
        //% block="umidade (0~100)" enumval=1
        DHT11_humidity,
    }

    /**
     * get Ultrasonic(sonar:bit) distance
     * @param distpin describe parameter here, eg: 1
     * @param trigpin describe parameter here, eg: DigitalPin.P14
     * @param echopin describe parameter here, eg: DigitalPin.P15
     */
    //% blockId=leiturasonar block="Sonar trigger %trigpin|echo %echopin|distância em %distpin"
    //% weight = 10
    export function sonar(trigpin: DigitalPin, echopin: DigitalPin, distpin: Distance_Unit): number {

        // send pulse
        pins.setPull(trigpin, PinPullMode.PullNone)
        pins.digitalWritePin(trigpin, 0)
        control.waitMicros(2)
        pins.digitalWritePin(trigpin, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trigpin, 0)

        // read pulse
        let d = pins.pulseIn(echopin, PulseValue.High, 23000)  // 8 / 340 = 
        let distance = d * 10 * 5 / 3 / 58

        if (distance > 4000) distance = 2

        switch (distpin) {
            case 0:
                return Math.round(d) //ms
                break
            case 1:
                return Math.round(distance / 10)  //cm
                break
            default:
                return 0

        }

    }

    //% blockId=mbit_ultrasonic block="Distância do sensor ultrasônico (cm) "
    //% weight=98
    //% blockGap=10
    export function Ultrasonic(): number {

        // send pulse
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P14, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P14, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P14, 0);

        // read pulse
        let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 23200);
        return Math.floor((d + 112) / 56);
    }


    /**
         * get dht11 temperature and humidity Value
         * @param dht11pin describe parameter here, eg: DigitalPin.P15     */
    //% blockId="readdht11" block="Valor do sensor de temperatura e umidade %dht11type| no pino %dht11pin"
    //% weight=98
    //% blockGap=10


    export function dht11value(dht11type: DHT11Type, dht11pin: DigitalPin): number {

        pins.digitalWritePin(dht11pin, 0)
        basic.pause(18)
        //let i = pins.digitalReadPin(dht11pin)
        pins.setPull(dht11pin, PinPullMode.PullUp);
        basic.pause(2000)
        switch (dht11type) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0);
                    dhtcounter1 = 0
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 2) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ff00) >> 8);
                break;
            case 1:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0);
                    counter = 0
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 3) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
    }
    /**
        * get Ultrasonic(sonar:bit) distance
        * @param servopin descreve qual porta o servomotor estar, eg: DigitalPin.P12
        * @param Deg descreve qual angulo o servo irá, eg: 180
        * @param Temp descreve qual o tempo para cada degrau por segundo, eg: 100
        */
    //% blockId=servomotorpin block="Servo grava na porta %servopin| para %Deg| graus com ajuste de tempo %Temp| ms"
    //% weight = 12
    export function Servo(servopin: AnalogPin, Deg: number, Temp: number): void {
        let i;
        for (let i = 0; i < Deg; i++) {
            pins.servoWritePin(servopin, i)
            basic.pause(Temp)
        }
    }
    /**
        * get Ultrasonic(sonar:bit) distance
        * @param servopin descreve qual porta o servomotor estar, eg: DigitalPin.P12
        * @param Deg descreve qual angulo o servo irá, eg: 180
        * @param Temp descreve qual o tempo para cada degrau por segundo, eg: 100
        * @param Deg1  descreve qual angulo o servo esta, eg: 0
        */
    //% blockId=servomotorpos block="Mover o servo motor na porta %servopin| de %Deg1|° para %Deg|° com ajuste de tempo %Temp ms"
    //% weight = 10
    export function Servopos(servopin: AnalogPin, Deg1: number, Deg: number, Temp: number): void {
        let i;
        if (Deg1 < Deg) {
            for (let i = Deg1; i < Deg; i++) {
                pins.servoWritePin(servopin, i)
                basic.pause(Temp)
            }
        }
        else {
            for (let i = Deg1; i > Deg; i--) {
                pins.servoWritePin(servopin, i)
                basic.pause(Temp)
            }
        }
    }
}


