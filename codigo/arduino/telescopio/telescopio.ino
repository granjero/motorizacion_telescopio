// librerias
#include <Arduino.h>
#include <AccelStepper.h>
#include <SerialCommands.h>

// constantes
#define ENABLE_PIN 8 // pin del Arduino conectado al enable de los drivers de los motores
#define VEL_MAX 10000

// inicializacion de los motores
AccelStepper azimut(AccelStepper::DRIVER, 2, 5);
AccelStepper elevacion(AccelStepper::DRIVER, 3, 6);
// SerialCommands
char serial_command_buffer_[32];
SerialCommands serial_commands_(&Serial, serial_command_buffer_, sizeof(serial_command_buffer_), "\r\n", " ");

// funciones serial
// ****************
//This is the default handler, and gets called when no other command matches. 
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
    char* estadoMotor = sender->Next();

    azimut.enableOutputs(); 
    azimut.setSpeed(atoi(velocidad));
    sender->GetSerial()->print("Velocidad motor AZIMUT: ");
    sender->GetSerial()->println(velocidad);
}
// ELEVACION comnados para el motor de control de elevacion
void cmd_elevacion(SerialCommands* sender)
{
    char* velocidad = sender->Next();
    char* estadoMotor = sender->Next();

    elevacion.enableOutputs(); 
    elevacion.setSpeed(atoi(velocidad));
    sender->GetSerial()->print("Velocidad motor :ELEVACION ");
    sender->GetSerial()->println(velocidad);
}
// OFF apaga los motores
void cmd_off(SerialCommands* sender)
{
    azimut.disableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin
    sender->GetSerial()->println("MOTORES OFF");
}

// declaracion de variables a enviar por serial
SerialCommand cmd_azimut_("AZ", cmd_azimut);
SerialCommand cmd_elevacion_("EL", cmd_elevacion);
SerialCommand cmd_off_("OFF", cmd_off);


bool andando = true;

void setup() {
    Serial.begin(115200); // comienza la comunicacion serial

    // inicializacion de los comandos definidos
    serial_commands_.SetDefaultHandler(&cmd_unrecognized);
    serial_commands_.AddCommand(&cmd_azimut_);
    serial_commands_.AddCommand(&cmd_elevacion_);
    serial_commands_.AddCommand(&cmd_off_);

    Serial.println("Motores Telescopio 0.1 -> Ready");

    // motor AZIMUT
    azimut.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    azimut.setEnablePin(ENABLE_PIN);
    azimut.setMaxSpeed(VEL_MAX);
    /*azimut.setSpeed(500.0);*/

    // motor ELEVACION
    elevacion.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    elevacion.setEnablePin(ENABLE_PIN);
    elevacion.setMaxSpeed(VEL_MAX);
    /*elevacion.setSpeed(500.0);*/
}

void loop() {

	serial_commands_.ReadSerial(); // SerialCommands

    if(andando)
    {
        azimut.runSpeed();
        elevacion.runSpeed();
    }
}
