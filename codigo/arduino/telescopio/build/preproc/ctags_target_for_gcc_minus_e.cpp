# 1 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino"
# 2 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2
# 3 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2
# 4 "/Users/juanmiguel/telesy/codigo/arduino/telescopio/telescopio.ino" 2



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

    azimut.setEnablePin(8);
    azimut.setMaxSpeed(5000.0);
    azimut.setSpeed(500.0);

    elevacion.setPinsInverted(false, false, true);

    elevacion.setEnablePin(8);
    elevacion.setMaxSpeed(5000.0);
    elevacion.setSpeed(500.0);
}

void loop() {

 serial_commands_.ReadSerial();

    if(andando)
    {
        azimut.runSpeed();
        elevacion.runSpeed();
    }
}
