#line 1 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
// librerias
#include <Arduino.h>
#include <AccelStepper.h>
#include <SerialCommands.h>

// constantes
#define ENABLE_PIN 8 // pin del Arduino conectado al enable de los drivers de los motores
#define VEL_MAX 10000
#define ACELERACION 2000
// variables
bool andando = true;
bool acelerado = true;
int posAZ = 0;
int posEL = 0;

// inicializacion de los motores
AccelStepper azimut(AccelStepper::DRIVER, 2, 5);
AccelStepper elevacion(AccelStepper::DRIVER, 3, 6);
// SerialCommands
char serial_command_buffer_[32];
SerialCommands serial_commands_(&Serial, serial_command_buffer_, sizeof(serial_command_buffer_), "\r\n", " ");

// funciones serial
// ****************
//This is the default handler, and gets called when no other command matches. 
#line 26 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_unrecognized(SerialCommands* sender, const char* cmd);
#line 33 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_azimut(SerialCommands* sender);
#line 47 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_azimut_pos(SerialCommands* sender);
#line 64 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_elevacion(SerialCommands* sender);
#line 78 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_elevacion_pos(SerialCommands* sender);
#line 95 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_off(SerialCommands* sender);
#line 115 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void setup();
#line 145 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void loop();
#line 26 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_unrecognized(SerialCommands* sender, const char* cmd)
{
    sender->GetSerial()->print("Unrecognized command [");
    sender->GetSerial()->print(cmd);
    sender->GetSerial()->println("]");
}
// AZIMUT comnados para el motor de control azimutal
void cmd_azimut(SerialCommands* sender)
{
    char* velocidad = sender->Next();

    andando = true;
    acelerado = false;

    azimut.enableOutputs(); 
    azimut.setMaxSpeed(VEL_MAX);
    azimut.setSpeed(atol(velocidad));
    sender->GetSerial()->print("Velocidad motor AZIMUT: ");
    sender->GetSerial()->println(velocidad);
}
// AZIMUT comnados para el motor de control azimutal
void cmd_azimut_pos(SerialCommands* sender)
{
    char* posDestino = sender->Next();
    char* velocidad = sender->Next();

    andando = true;
    acelerado = true;

    azimut.enableOutputs(); 
    azimut.setMaxSpeed(atoi(velocidad));
    azimut.moveTo(atol(posDestino));
    sender->GetSerial()->print("Posicion destino motor AZIMUT: ");
    sender->GetSerial()->println(posDestino);
    sender->GetSerial()->print("Velocidad motor AZIMUT: ");
    sender->GetSerial()->println(velocidad);
}
// ELEVACION comnados para el motor de control de elevacion
void cmd_elevacion(SerialCommands* sender)
{
    char* velocidad = sender->Next();
    char* estadoMotor = sender->Next();
    
    andando = true;
    acelerado = false;

    elevacion.enableOutputs(); 
    elevacion.setSpeed(atoi(velocidad));
    sender->GetSerial()->print("ELEVACION Vel: ");
    sender->GetSerial()->println(velocidad);
}
// ENABLE_PIN comnados para el motor de control de elevacion
void cmd_elevacion_pos(SerialCommands* sender)
{
    char* posDestino = sender->Next();
    char* velocidad = sender->Next();

    andando = true;
    acelerado = true;

    elevacion.enableOutputs(); 
    elevacion.setMaxSpeed(atoi(velocidad));
    elevacion.moveTo(atol(posDestino));
    sender->GetSerial()->print("ELEVACION Pos: ");
    sender->GetSerial()->print(posDestino);
    sender->GetSerial()->print(" Vel: ");
    sender->GetSerial()->println(velocidad);
}
// OFF apaga los motores
void cmd_off(SerialCommands* sender)
{
    andando = false; // para que deje de contar pasos.
    azimut.stop();
    elevacion.stop();
    azimut.disableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin
    sender->GetSerial()->println("MOTORES OFF");
}

// declaracion de variables a enviar por serial
SerialCommand cmd_azimut_("AZ", cmd_azimut);
SerialCommand cmd_azimut_pos_("AZp", cmd_azimut_pos);
SerialCommand cmd_elevacion_("EL", cmd_elevacion);
SerialCommand cmd_elevacion_pos_("ELp", cmd_elevacion_pos);
SerialCommand cmd_off_("OFF", cmd_off);


// ************
// ************

void setup() {
    Serial.begin(115200); // comienza la comunicacion serial

    // inicializacion de los comandos definidos
    serial_commands_.SetDefaultHandler(&cmd_unrecognized);
    serial_commands_.AddCommand(&cmd_azimut_);
    serial_commands_.AddCommand(&cmd_azimut_pos_);
    serial_commands_.AddCommand(&cmd_elevacion_);
    serial_commands_.AddCommand(&cmd_elevacion_pos_);
    serial_commands_.AddCommand(&cmd_off_);

    Serial.println("Motores Telescopio 0.1 -> Ready");

    // motor AZIMUT
    azimut.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    azimut.setEnablePin(ENABLE_PIN);
    azimut.setMaxSpeed(VEL_MAX);
    azimut.setAcceleration(ACELERACION);
    /*azimut.setSpeed(500.0);*/

    // motor ELEVACION
    elevacion.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    elevacion.setEnablePin(ENABLE_PIN);
    elevacion.setMaxSpeed(VEL_MAX);
    elevacion.setAcceleration(ACELERACION);
    /*elevacion.setSpeed(500.0);*/

    azimut.disableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin
}

void loop() {

	serial_commands_.ReadSerial(); // SerialCommands

    if(andando)
    {
        if(acelerado)
        {
            azimut.run();
            elevacion.run();
        }
        else
        {
            azimut.runSpeed();
            elevacion.runSpeed();
        }
    }
    /*Serial.println(azimut.currentPosition());*/
}

