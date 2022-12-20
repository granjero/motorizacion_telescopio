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
        <img src="/archivos/software/stellarium_locacion_1.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;
      - Setear latitud, longitud y altitud snm
        &nbsp;  
        <img src="/archivos/software/stellarium_locacion_2.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;

   2. Fecha y Hora

      - Con F5 o a través del menú de la izquierda se ingresa al menú de Fecha y Hora.
        &nbsp;  
        <img src="/archivos/software/stellarium_fecha_1.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;
      - Setear correctamente la hora local.
        &nbsp;  
        <img src="/archivos/software/stellarium_fecha_2.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;

4. Plugin Control Remoto

   - Con F2 o a través del menú de la izquierda se ingresa al menú de configuraciones.
     &nbsp;  
     <img src="/archivos/software/stellarium_plugin_1.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;
   - Ir a la solapa Plugins y seleccionar el Plugin _Remote Control_.
     &nbsp;  
     <img src="/archivos/software/stellarium_plugin_2.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;
   - Tildar la casilla _Load at Startup_ y reiniciar Stellarium para poder ingresar a la configuracion del mismo.
     Tildar la casilla Enable CORS for the following origin y en el campo poner un \*.
     _Leer advertencia al respecto del \* en stellarium_
     &nbsp;  
     <img src="/archivos/software/stellarium_plugin_3.png" width=25% height=25%> &nbsp; &nbsp; &nbsp;

## Panel de Control

##### Librerías utilizadas:

- [Bootstrap](https://www.airspayce.com/mikem/arduino/AccelStepper/)
- [Font Awesome](https://github.com/ppedro74/Arduino-SerialCommands)
