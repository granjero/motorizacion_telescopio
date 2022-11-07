// librerias
#include <Arduino.h>
#include <math.h>
#include <AccelStepper.h>
#include <SerialCommands.h>

// constantes
#define ENABLE_PIN 8 // pin del Arduino conectado al enable de los drivers de los motores
#define PASOS_MOTOR 1600L // pasos para dar una vuelta contando el microstepping
#define RELACION_AZ 20 // relacion entre la cant de dientes del piñon y la corona azimutales (en mi caso 400 / 20)
#define RELACION_EL 20 // relacion entre la cant de dientes del piñon y la corona elevacion (en mi caso 400 / 20)
#define VEL_MAX 2000
#define ACELERACION 2000

// variables
bool andando = true;
bool constante = false;

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

/*MOTOR AZIMUT*/
/*------------*/
// MOTOR AZIMUT VELOCIDAD CONSTANTE
// comando serial: AZ velocidad
void cmd_azimut_vel_cte(SerialCommands* sender)
{
    char* velocidad = sender->Next();
    // TODO controlar que atol(velocidad) esté entre 0 y VEL_MAX
    andando = true;
    constante = true;

    azimut.enableOutputs(); 
    azimut.setMaxSpeed(VEL_MAX);
    azimut.setSpeed(atol(velocidad));
    sender->GetSerial()->print("Velocidad motor AZIMUT: ");
    sender->GetSerial()->println(velocidad);
}
// MOTOR AZIMUT IR A POSICION SEGUN ANGULO
// comando serial: AZp angulo velocidad
void cmd_azimut_pos(SerialCommands* sender)
{
    char* angulo = sender->Next();
    char* velocidad = sender->Next();
    // TODO controlar que atol(velocidad) esté entre 0 y VEL_MAX
    // TODO controlar que anguloAzimutAPaso se encuentre entre 0 y 360
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
// MOTOR AZIMUT AVANZA X
// comando serial: AZa grados velocidad
void cmd_azimut_avanza(SerialCommands* sender)
{
    char* grados = sender->Next();

    andando = true;
    constante = false;

    azimut.enableOutputs(); 
    azimut.setMaxSpeed(VEL_MAX);
    azimut.moveTo(
            azimut.currentPosition() + anguloAzimutAPaso(atof(grados))
            );
    sender->GetSerial()->print("Mueve:  ");
    sender->GetSerial()->println(grados);
}
/*MOTOR ELEVACION*/
/*---------------*/
// MOTOR ELEVACION VELOCIDAD CONSTANTE
// comando serial: EL velocidad
void cmd_elevacion_vel_cte(SerialCommands* sender)
{
    char* velocidad = sender->Next();
    
    andando = true;
    constante = true;

    elevacion.enableOutputs(); 
    elevacion.setMaxSpeed(VEL_MAX);
    elevacion.setSpeed(atoi(velocidad));
    sender->GetSerial()->print("EL vel: ");
    sender->GetSerial()->println(velocidad);
}
// MOTOR ELEVACION IR A POSICION SEGUN ANGULO
// comando serial: ELp angulo velocidad
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
// MOTOR ELEVACION AVANZA X
// comando serial: ELa grados velocidad
void cmd_elevacion_avanza(SerialCommands* sender)
{
    char* grados = sender->Next();

    andando = true;
    constante = false;

    elevacion.enableOutputs(); 
    elevacion.setMaxSpeed(VEL_MAX);
    elevacion.moveTo(
            elevacion.currentPosition() + anguloElevacionAPaso(atof(grados))
            );
    sender->GetSerial()->print("Mueve:  ");
    sender->GetSerial()->println(grados);

}

// GO HOME (u r drunk)
void cmd_go_home(SerialCommands* sender)
{
    andando = true;
    constante = false;

    elevacion.enableOutputs(); 
    elevacion.setMaxSpeed(VEL_MAX);
    elevacion.moveTo(0);
    azimut.enableOutputs();
    azimut.setMaxSpeed(VEL_MAX);
    azimut.moveTo(0);

    sender->GetSerial()->print("Yendo a Casa ");

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
SerialCommand cmd_azimut_vel_cte_("AZ", cmd_azimut_vel_cte);
SerialCommand cmd_azimut_pos_("AZp", cmd_azimut_pos);
SerialCommand cmd_azimut_avanza_("AZa", cmd_azimut_avanza);
SerialCommand cmd_elevacion_vel_cte_("EL", cmd_elevacion_vel_cte);
SerialCommand cmd_elevacion_pos_("ELp", cmd_elevacion_pos);
SerialCommand cmd_elevacion_avanza_("ELa", cmd_elevacion_avanza);
SerialCommand cmd_go_home_("HOME", cmd_go_home);
SerialCommand cmd_off_("OFF", cmd_off);


// angulo a nro de paso
// @param angulo de destino
// @return numero de paso correspondiente al angulo
long anguloElevacionAPaso(float angulo)
{
    return round((angulo * PASOS_MOTOR * RELACION_EL) / 360);
}
// @param angulo de destino
// @return numero de paso correspondiente al angulo
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
    serial_commands_.AddCommand(&cmd_azimut_vel_cte_);
    serial_commands_.AddCommand(&cmd_azimut_pos_);
    serial_commands_.AddCommand(&cmd_azimut_avanza_);
    serial_commands_.AddCommand(&cmd_elevacion_vel_cte_);
    serial_commands_.AddCommand(&cmd_elevacion_pos_);
    serial_commands_.AddCommand(&cmd_elevacion_avanza_);
    serial_commands_.AddCommand(&cmd_go_home_);
    serial_commands_.AddCommand(&cmd_off_);

    Serial.println("Motores Telescopio 0.1 -> Ready");

    // motor AZIMUT
    azimut.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    azimut.setEnablePin(ENABLE_PIN);
    azimut.setMaxSpeed(VEL_MAX);
    azimut.setAcceleration(ACELERACION);
    azimut.setSpeed(0);

    // motor ELEVACION
    elevacion.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    elevacion.setEnablePin(ENABLE_PIN);
    elevacion.setMaxSpeed(VEL_MAX);
    elevacion.setAcceleration(ACELERACION);
    elevacion.setSpeed(0);

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
    /*Serial.println(azimut.currentPosition());*/
}
