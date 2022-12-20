# 🔭 Montura Dobson Motorizada

https://github.com/granjero/telescopio

Proyecto para motorizar/robotizar la montura Dobson del telescopio modelo que se realiza en el curso de fabricación de telescopios de la ASARAMAS (https://amigosdelaastronomia.org/)  
&nbsp;  
<img src="/archivos/telescopio.png" width=100% height=100%> &nbsp; &nbsp; &nbsp;

## 🚨 🚨 🚨 ¡¡¡ ADVERTENCIA !!! 🚨 🚨 🚨

El software de este proyecto **_NO_** impide que durante su recorrido el telescopio apunte al SOL ☀️  
Mirar el sol a través de un telescopio puede causar **CEGUERA IRREVERSIBLE** 👁 👨‍🦯 y/o daños a los esquipos.
Utilizar sólo cuando el sol se haya ocultado en el horizonte o con los filtros necesarios.

> Este software se proporciona "tal cual" y no se entrega ninguna garantía, expresa o implícita, en cuanto a su exactitud, integridad o rendimiento.  
> En ningún caso seré responsable de cualquier daño directo, indirecto, incidental, especial, consecuencial o ejemplar, resultante del uso del software de este proyecto.  
> El usuario asume el riesgo completo y la responsabilidad total en cuanto al uso y resultados del presente software.

### 📓 Resumen

En la [ASARAMAS](https://amigosdelaastronomia.org/) dictan un curso para fabricar un telescopio reflector del tipo Newtoniano con una montura tipo Dobson.  
El objetivo de este proyecto es automatizar la montura para que el telescopio localice y siga objetos celestes a demanda. Para ello se agregarán al telescopio dos motores. Uno para controlar el ángulo del Azimut y otro para controlar el ángulo de Elevación .  
Se interactúa con el telescopio a través de un panel de control que toma datos de [Stellarium](https://stellarium.org/) y los envia al microcontrolador del telescopio.  
La electrónica es muy sencilla, como microcontrolador se utiliza un ArduinoUNO, para manejar la potencia de los motores se pueden utilizar driver A4988 ó DRV8825 y un ShieldCNC para la conección.
En el proyecto están todos los archivos necesarios para imprimir o cortar las piezas y también están los scripts con los que fueron generadas.  
Seguir las instrucciones en orden.

### ⚙️ Instrucciones

- [Lista de Materiales](MATERIALES.md)
- [Hardware](/HARDWARE.md)
- [Firmware](/FIRMWARE.md)
- [Software](/SOFTWARE.md)
