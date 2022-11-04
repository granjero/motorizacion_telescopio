#include <Arduino.h>
#include <AccelStepper.h>
#include <SerialCommands.h>

#define ENABLE_PIN 8
#define VEL_MAX 10000

AccelStepper azimut(AccelStepper::DRIVER, 2, 5);
AccelStepper elevacion(AccelStepper::DRIVER, 3, 6);

char serial_command_buffer_[32];
SerialCommands serial_commands_(&Serial, serial_command_buffer_, sizeof(serial_command_buffer_), "\r\n", " ");

//This is the default handler, and gets called when no other command matches. 
void cmd_unrecognized(SerialCommands* sender, const char* cmd)
{
    sender->GetSerial()->print("Unrecognized command [");
    sender->GetSerial()->print(cmd);
    sender->GetSerial()->println("]");
}

// AZIMUT
void cmd_azimut(SerialCommands* sender)
{
    char* velocidad = sender->Next();
    char* estadoMotor = sender->Next();

    azimut.enableOutputs(); // funciona al revés
    azimut.setSpeed(atoi(velocidad));
    sender->GetSerial()->println(velocidad);
}

// OFF
void cmd_off(SerialCommands* sender)
{
    azimut.disableOutputs(); // funciona al revés
    sender->GetSerial()->println("MOTORES OFF");
}

SerialCommand cmd_azimut_("AZ", cmd_azimut);
SerialCommand cmd_off_("OFF", cmd_off);





bool andando = true;

void setup() {
    Serial.begin(115200);

	serial_commands_.SetDefaultHandler(&cmd_unrecognized);
    serial_commands_.AddCommand(&cmd_azimut_);
    serial_commands_.AddCommand(&cmd_off_);

    Serial.println("Motores Telescopio 0.1");


    azimut.setPinsInverted(false, false, true);

    azimut.setEnablePin(ENABLE_PIN);
    azimut.setMaxSpeed(VEL_MAX);
    /*azimut.setSpeed(500.0);*/

    elevacion.setPinsInverted(false, false, true);

    elevacion.setEnablePin(ENABLE_PIN);
    elevacion.setMaxSpeed(VEL_MAX);
    /*elevacion.setSpeed(500.0);*/
}

void loop() {

	serial_commands_.ReadSerial();

    if(andando)
    {
        azimut.runSpeed();
        elevacion.runSpeed();
    }
}
