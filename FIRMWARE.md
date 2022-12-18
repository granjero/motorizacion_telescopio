# FIRMWARE

#### Instrucciones para cargar el firmware.

## Arduino IDE

1. [Descargar](https://github.com/arduino/arduino-ide/releases) el IDE de Arduino.
2. Ejecutar el IDE de Arduino
   - Conectar el Arduino al ordenador con el cable USB
   - Ir a Herramientas/Tools -> Placas/Boards y seleccionar Arduino UNO
   - Ir a Herramientas/Tools -> Puerto/Port y seleccionar el puerto en el que esté conectado el Arduino

## Firmware

Si se usaron las piezas estándar del proyecto saltear el paso 3 y pasar al paso 4.

3. Abrir el archivo telescopio.ino

Para que los movimientos del telescopio sean correctos el microcontrolador necesita conocer las relaciones entre los piñones y las coronas.  
Para que los cálculos sean correctos hay que modificar el Firmware y asignar a algunas constantes estos valores.

- Cambiar los valores de las constantes "PASOS_MOTOR\_", "MICROSTEPS\_", "DIENTES_CORONA\_", "DIENTES_PINON\_" para AZIMUT y ELEVACION según corresponda con la construccion del telescopio.
- Guardar el Sketch

4. Abrir el archivo telescopio.ino

   - Ir a Programa/Sketch -> Subir/Upload

5. Una vez subido el programa desconectar el Arduino del ordenador y continuar con la conección del Shield CNC. (Ver seccion Hardware)

##### Librerías utilizadas:

- [AccelStepper](https://www.airspayce.com/mikem/arduino/AccelStepper/)
- [SerialCommands](https://github.com/ppedro74/Arduino-SerialCommands)
