# SOFTWARE

#### Instrucciones de uso del Panel de Control .

El panel de control es un archivo html que se debe cargar en un navegador web que soporte comunicación serie como [Chromium](https://www.chromium.org/getting-involved/download-chromium/) o Chrome.
[Navegadores compatibles](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort#browser_compatibility)  
A su vez este proyecto depende de Stellarium para obtener la ubicacion de los objetos celestes para enviarlos al telescopio.

## Stellarium

1. [Descargar](https://stellarium.org) stellarium 1.1 o superior.
2. Ejecutar Stellarium
3. Configuraciones
   1. Locación
      - Con F6 o a través del menú de la izquierda se ingresa al menú de Locación.
        &nbsp;  
        <img src="/archivos/azimut/corona_instalacion_1.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;
      - Setear latitud, longitud y altitud snm
   2.

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
