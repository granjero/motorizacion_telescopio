## Instrucciones para el Firmware.

1. [Descargar](https://github.com/arduino/arduino-ide/releases) el IDE de Arduino.
2. Ejecutar el IDE de Arduino
   - Conectar el arduino al ordenador con el cable USB
   - Ir a Herramientas/Tools -> Placas/Boards y seleccionar Arduino UNO
   - Ir a Herramientas/Tools -> Puerto/Port y seleccionar el puerto en el que esté conectado el Arduino

```
Se deben especificar en el programa la cantidad de dientes de las coronas y los piñones del telescopio.
En las primeras
```

3. Abrir el archivo telescopio.ino
   - Cambiar los valores de las constantes "PASOS_MOTOR\_", "MICROSTEPS\_", "DIENTES_CORONA\_", "DIENTES_PINON\_" según corresponda
   - Ir a Programa/Sketch -> Subir/Upload

##### Librerías utilizadas:

- [AccelStepper](https://www.airspayce.com/mikem/arduino/AccelStepper/)
- [SerialCommands](https://github.com/ppedro74/Arduino-SerialCommands)
