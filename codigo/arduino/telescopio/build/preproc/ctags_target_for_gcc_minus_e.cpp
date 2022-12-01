# 1 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
// librerias
# 3 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2
# 4 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2
# 5 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2
# 6 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2

// constantes



// AZIMUT




// ELEVACION






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

// SEGUIMIENTO
// comando serial: SEG azimut elevacion
void cmd_seguimiento(SerialCommands* sender)
{
    char* AZ = sender->Next();
    char* EL = sender->Next();

    andando = true;
    constante = false;

    azimut.enableOutputs();
    azimut.setMaxSpeed(1000);
    azimut.moveTo(anguloAzimutAPaso(atof(AZ)));

    elevacion.enableOutputs();
    elevacion.setMaxSpeed(1000);
    elevacion.moveTo(anguloElevacionAPaso(atof(EL)));

    sender->GetSerial()->print("AZ: ");
    sender->GetSerial()->println(AZ);
    sender->GetSerial()->print("EL: ");
    sender->GetSerial()->println(EL);
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
    azimut.setMaxSpeed(1000);
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
    azimut.setMaxSpeed(1000);
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
    elevacion.setMaxSpeed(1000);
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
    elevacion.setMaxSpeed(1000);
    elevacion.moveTo(
            elevacion.currentPosition() + anguloElevacionAPaso(atof(grados))
            );
    sender->GetSerial()->print("Mueve:  ");
    sender->GetSerial()->println(grados);

}

// SET HOME 
void cmd_set_home(SerialCommands* sender)
{
    andando = false;
    constante = false;

    azimut.stop();
    elevacion.stop();
    azimut.disableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin
    azimut.setCurrentPosition(0);
    elevacion.setCurrentPosition(90);
    azimut.enableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin

    sender->GetSerial()->print("ELEVACION 90 AZIMUT 360");
}

// SET NEW HOME 
void cmd_set_new_home(SerialCommands* sender)
{
    andando = true;
    constante = false;

    char* az = sender->Next();
    char* el = sender->Next();

    azimut.setCurrentPosition(azimut.currentPosition() + atol(az));
    elevacion.setCurrentPosition(elevacion.currentPosition() + atol(el));
    // elevacion.setCurrentPosition(90);

    sender->GetSerial()->print("Azimut + ");
    sender->GetSerial()->println(az);
    sender->GetSerial()->print("Elevacion + ");
    sender->GetSerial()->println(el);
}

// GO HOME (u r drunk)
void cmd_go_home(SerialCommands* sender)
{
    andando = true;
    constante = false;

    elevacion.enableOutputs();
    elevacion.setMaxSpeed(1000);
    elevacion.moveTo(90);
    azimut.enableOutputs();
    azimut.setMaxSpeed(1000);
    azimut.moveTo(0);

    sender->GetSerial()->print("Yendo a Casa ");

}
// OFF apaga los motores
void cmd_off(SerialCommands* sender)
{
    andando = true; // para que deje de contar pasos.
    constante = false;

    /*azimut.stop();*/
    /*elevacion.stop();*/
    azimut.disableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin
    sender->GetSerial()->println("MOTORES OFF");
}

// STOP detiene los motores
void cmd_stop(SerialCommands* sender)
{
    andando = true; // para que deje de contar pasos.
    constante = false;

    azimut.stop();
    elevacion.stop();
    /*azimut.disableOutputs(); // uso azimut pero podría usar elevacion porque compraten el pin*/
    sender->GetSerial()->println("MOTORES STOP");
}
// funciones serial command
// ************************
// declaracion de variables a enviar por serial
SerialCommand cmd_seguimiento_("SEG", cmd_seguimiento);
SerialCommand cmd_azimut_vel_cte_("AZ", cmd_azimut_vel_cte);
SerialCommand cmd_azimut_pos_("AZp", cmd_azimut_pos);
SerialCommand cmd_azimut_avanza_("AZa", cmd_azimut_avanza);
SerialCommand cmd_elevacion_vel_cte_("EL", cmd_elevacion_vel_cte);
SerialCommand cmd_elevacion_pos_("ELp", cmd_elevacion_pos);
SerialCommand cmd_elevacion_avanza_("ELa", cmd_elevacion_avanza);
SerialCommand cmd_go_home_("GO_HOME", cmd_go_home);
SerialCommand cmd_set_home_("SET_HOME", cmd_set_home);
SerialCommand cmd_set_new_home_("NEW_HOME", cmd_set_new_home);
SerialCommand cmd_off_("OFF", cmd_off);
SerialCommand cmd_stop_("STOP", cmd_stop);

// angulo a nro de paso
// @param angulo de destino
// @return numero de paso correspondiente al angulo
long anguloElevacionAPaso(float angulo)
{
    return round((angulo * 200L /*  cant de pasos del motor (Dejar la L al final del numero)*/ * 16 /* microstepping = [full step = 1] [half step = 2] [quarter step = 4] [eighth step = 8] [sixteenth step = 16]*/ * (400 / 20)) / 360);
}
// @param angulo de destino
// @return numero de paso correspondiente al angulo
long anguloAzimutAPaso(float angulo)
{

    long pasosUnaVueltaMotor = 200L /*  cant de pasos del motor (Dejar la L al final del numero)*/ * 16 /* microstepping = [full step = 1] [half step = 2] [quarter step = 4] [eighth step = 8] [sixteenth step = 16]*/;
    long relacionEngranajes = 400 / 20;
    long pasosUnaVuelta360 = pasosUnaVueltaMotor * relacionEngranajes;
    long pasosUnGrado = pasosUnaVuelta360 / 360;
    long pasosAngulo = round(angulo * pasosUnGrado);

    return pasosAngulo;
}

// ************
// ************

void setup() {
    Serial.begin(115200); // comienza la comunicacion serial

    // inicializacion de los comandos definidos
    serial_commands_.SetDefaultHandler(&cmd_unrecognized);
    serial_commands_.AddCommand(&cmd_seguimiento_);
    serial_commands_.AddCommand(&cmd_azimut_vel_cte_);
    serial_commands_.AddCommand(&cmd_azimut_pos_);
    serial_commands_.AddCommand(&cmd_azimut_avanza_);
    serial_commands_.AddCommand(&cmd_elevacion_vel_cte_);
    serial_commands_.AddCommand(&cmd_elevacion_pos_);
    serial_commands_.AddCommand(&cmd_elevacion_avanza_);
    serial_commands_.AddCommand(&cmd_go_home_);
    serial_commands_.AddCommand(&cmd_set_home_);
    serial_commands_.AddCommand(&cmd_set_new_home_);
    serial_commands_.AddCommand(&cmd_off_);
    serial_commands_.AddCommand(&cmd_stop_);

    Serial.println("Motores Telescopio 0.1 -> Ready");

    // motor AZIMUT
    azimut.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    azimut.setEnablePin(8 /* pin del Arduino conectado al enable de los drivers de los motores*/);
    azimut.setMaxSpeed(1000);
    azimut.setAcceleration(500);
    azimut.setSpeed(0);

    // motor ELEVACION
    elevacion.setPinsInverted(false, false, true); // el pin enable funciona cuando está el LOW.
    elevacion.setEnablePin(8 /* pin del Arduino conectado al enable de los drivers de los motores*/);
    elevacion.setMaxSpeed(1000);
    elevacion.setAcceleration(500);
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
