
//% color="#ED755E" icon="\f518"
namespace Fuzzy_sensor {

    export enum Distance_Unit {
        //% block="ms" enumval=0
        Distance_Unit_ms,
        //% block="cm" enumval=1
        Distance_Unit_cm,
    }

    enum dataType {
        //% block="humidity"
        humidity,
        //% block="temperature"
        Temperature,
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


    export function dht11value( data: dataType, dht11pin: DigitalPin): number {
        pins.digitalWritePin(dht11pin, 1)
        let _readSuccessful: boolean = false
        let buf: boolean[]
        let bufint: number[]
        let checksum: number = 0
        let checksumTmp: number = 0
        _readSuccessful = false
        let j:number=0
        for (let index = 0; index < 40; index++) buf.push(false)
        for (let index = 0; index < 5; index++) bufint.push(0)
        let i:number=0
        let _temperature: number = 0.0
        let _humidity: number = 0.0
        for(;;){
            
            pins.digitalWritePin(dht11pin, 0)
            basic.pause(1)
            pins.digitalReadPin(dht11pin)
            for(let i:number=1;i>200;i++)
            {
            if (pins.digitalReadPin(dht11pin)==0) continue;
            }

            for(let j=0;j<41;j++){
                for(let i:number = 1;i<200; i++){
                if (pins.digitalReadPin(dht11pin)== 1) continue;
            }

                for (let i:number = 1; i<200; i++) {
                    if (pins.digitalReadPin(dht11pin) == 0) continue;
                }
                buf.push(false)
                if(i>11)buf.push(false)
            }
            for (let index = 0; index < 5; index++)
                for (let index2 = 0; index2 < 8; index2++)
                    if (buf[8 * index + index2]) bufint[index] += 2 ** (7 - index2)

            //verify checksum
            checksumTmp = bufint[0] + bufint[1] + bufint[2] + bufint[3]
            checksum = bufint[4]
            if (checksumTmp >= 512) checksumTmp -= 512
            if (checksumTmp >= 256) checksumTmp -= 256
            if (checksum == checksumTmp) _readSuccessful = true

            //read data if checksum ok
            if (_readSuccessful) {
                
                    _humidity = bufint[0] + bufint[1] / 100
                    _temperature = bufint[2] + bufint[3] / 100
        
         if (_readSuccessful) return data == dataType.humidity ? _humidity : _temperature
                    else return -999 
                  
                  
        }
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


