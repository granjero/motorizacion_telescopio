# 1 "/Users/juanmiguel/telesy/telescopio/telescopio.ino"
# 2 "/Users/juanmiguel/telesy/telescopio/telescopio.ino" 2
# 3 "/Users/juanmiguel/telesy/telescopio/telescopio.ino" 2
# 4 "/Users/juanmiguel/telesy/telescopio/telescopio.ino" 2

AccelStepper azimut(AccelStepper::DRIVER, 2, 5);
AccelStepper elevacion(AccelStepper::DRIVER, 3, 6);

elapsedMillis tiempoTranscurrido;

/*int vel_azimut = 0;*/
/*int vel_elevacion= 0;*/

bool AZ = false;
bool EL = false;

bool andando = true;

String comando = ""; // string que recibe lo que viene por el puerto serial
bool comandoRecibido = false;

void setup() {
    Serial.begin(115200);
    Serial.println("Motores Telescopio 0.1");

    azimut.setMaxSpeed(5000.0);
    azimut.setSpeed(5000.0);

    elevacion.setMaxSpeed(5000.0);
    elevacion.setSpeed(5000.0);
}

void loop() {

    while (Serial.available () > 0) processIncomingByte (Serial.read ());

    if(andando)
    {
        azimut.runSpeed();
        elevacion.runSpeed();
    }
}



// Basado en código de Nick Gammon
// http://www.gammon.com.au/serial

void process_data (const char * data) // here to process incoming serial data after a terminator received
{
    // for now just display it
    // (but you could compare it to some value, convert to an integer, etc.)
    /*Serial.println (data);*/
    /*data.trim();*/

    /*int posDelimitador = data.indexOf(':');*/
    /*char AZ = data.sub(0, posDelimitador);*/
    /*char EL = data.sub(posDelimitador + 1);*/

    char * AZ = strtok(data, ":");
    char * EL = strtok(
# 60 "/Users/juanmiguel/telesy/telescopio/telescopio.ino" 3 4
                      __null
# 60 "/Users/juanmiguel/telesy/telescopio/telescopio.ino"
                          , ":");
    /*AZ = strtok(NULL, '-');*/

    Serial.println(AZ);
    Serial.println(EL);
    azimut.setSpeed(atoi(AZ));
    elevacion.setSpeed(atoi(EL));
}

void processIncomingByte (const byte inByte)
{
    const unsigned int MAX_INPUT = 50;
    static char input_line [MAX_INPUT];
    static unsigned int input_pos = 0;

    switch (inByte)
    {
        case '\n': // end of text
            input_line [input_pos] = 0; // terminating null byte
            // terminator reached! process input_line here ...
            process_data (input_line);
            // reset buffer for next time
            input_pos = 0;
            break;

        case '\r': // discard carriage return
            break;

        default:
            // keep adding if not full ... allow for terminating null byte
            if (input_pos < (MAX_INPUT - 1))
            input_line [input_pos++] = inByte;
            break;

    }
}
