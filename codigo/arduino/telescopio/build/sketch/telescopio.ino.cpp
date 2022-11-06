#line 1 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
// librerias
#include <Arduino.h>
#include <math.h>
#include <AccelStepper.h>
#include <SerialCommands.h>

// constantes
#define ENABLE_PIN 8 // pin del Arduino conectado al enable de los drivers de los motores
#define PASOS_MOTOR 1600L // pasos para dar una vuelta contando el microstepping
#define RELACION_AZ 20L // relacion entre la cant de dientes del piñon y la corona azimutales (en mi caso 400 / 20)
#define RELACION_EL 20L // relacion entre la cant de dientes del piñon y la corona elevacion (en mi caso 400 / 20)
#define VEL_MAX 10000
#define ACELERACION 2000

// variables
bool andando = true;
bool constante = false;
/*bool motorAZ = false;*/
/*bool motorEL = false;*/
/*int posAZ = 0;*/
/*int posEL = 0;*/

// inicializacion de los motores
AccelStepper azimut(AccelStepper::DRIVER, 2, 5);
AccelStepper elevacion(AccelStepper::DRIVER, 3, 6);
// SerialCommands
char serial_command_buffer_[32];
SerialCommands serial_commands_(&Serial, serial_command_buffer_, sizeof(serial_command_buffer_), "\r\n", " ");

// funciones serial
// ****************
//This is the default handler, and gets called when no other command matches. 
#line 33 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_unrecognized(SerialCommands* sender, const char* cmd);
#line 40 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_azimut(SerialCommands* sender);
#line 54 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_azimut_pos(SerialCommands* sender);
#line 72 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_elevacion(SerialCommands* sender);
#line 90 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_elevacion_pos(SerialCommands* sender);
#line 109 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void cmd_off(SerialCommands* sender);
#line 133 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
long anguloElevacionAPaso(float angulo);
#line 138 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
long anguloAzimutAPaso(float angulo);
#line 146 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void setup();
#line 176 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
void loop();
#line 33 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
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
    constante = true;

    azimut.enableOutputs(); 
    azimut.setMaxSpeed(VEL_MAX);
    azimut.setSpeed(atol(velocidad));
    sender->GetSerial()->print("Velocidad motor AZIMUT: ");
    sender->GetSerial()->println(velocidad);
}
// AZIMUT comnados para el motor de control azimutal
void cmd_azimut_pos(SerialCommands* sender)
{
    char* angulo = sender->Next();
    char* velocidad = sender->Next();

    andando = true;
    constante = false;

    azimut.enableOutputs(); 
    azimut.setMaxSpeed(atoi(velocidad));
    azimut.moveTo(anguloAzimutAPaso(atof(angulo)));
    sender->GetSerial()->print("Angulo destino motor AZIMUT: ");
    sender->GetSerial()->println(angulo);
    sender->GetSerial()->print("Velocidad motor AZIMUT: ");
    sender->GetSerial()->println(velocidad);
}
// ELEVACION comnados para el motor de control de elevacion
// acelera hasta la velocidad maxima
void cmd_elevacion(SerialCommands* sender)
{
    char* velocidad = sender->Next();
    /*char* estadoMotor = sender->Next();*/
    
    andando = true;
    constante = true;
    /*motorEL = true;*/

    elevacion.enableOutputs(); 
    /*elevacion.move(1600);*/
    elevacion.setMaxSpeed(atoi(velocidad));
    elevacion.setSpeed(atoi(velocidad));
    sender->GetSerial()->print("ELEVACION Vel: ");
    sender->GetSerial()->println(velocidad);
}
// ENABLE_PIN comnados para el motor de control de elevacion
// va a la posicion recibida
void cmd_elevacion_pos(SerialCommands* sender)
{
    char* angulo = sender->Next();
    char* velocidad = sender->Next();

    andando = true;
    constante = false;

    elevacion.enableOutputs(); 
    elevacion.setMaxSpeed(atoi(velocidad));
    elevacion.moveTo(anguloElevacionAPaso(atof(angulo)));
    sender->GetSerial()->print("ELEVACION angulo: ");
    sender->GetSerial()->println(angulo);
    sender->GetSerial()->print(" Posicion: ");
    sender->GetSerial()->print(anguloElevacionAPaso(atof(angulo)));
    sender->GetSerial()->print(" Vel: ");
    sender->GetSerial()->println(velocidad);
}
// OFF apaga los motores
void cmd_off(SerialCommands* sender)
{
    andando = false; // para que deje de contar pasos.
    constante = false;
    /*motorAZ = false;*/
    /*motorEL = false;*/

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



// angulo a pasos

long anguloElevacionAPaso(float angulo)
{
    return round((angulo * PASOS_MOTOR * RELACION_EL) / 360);
}

long anguloAzimutAPaso(float angulo)
{
    return round((angulo * PASOS_MOTOR * RELACION_AZ) / 360);
}

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
        if(constante)
        {
            azimut.runSpeed();
            elevacion.runSpeed();
        }
        else
        {
            azimut.run();
            elevacion.run();
        }
    }
    /*if (andando && !constante)*/
    /*{*/
        /*azimut.run();*/
        /*elevacion.run();*/
    /*}*/
    /*else if (andando && constante)*/
    /*{*/
        /*if (motorAZ)*/
        /*{*/
            /*azimut.move(1600);*/
        /*}*/

        /*if (motorEL)*/
        /*{*/
            /*elevacion.runSpeed();*/
            /*[>Serial.print("-");<]*/
        /*}*/

    /*}*/
    /*else */
    /*{*/

    /*}*/
    /*Serial.println(azimut.currentPosition());*/
}

