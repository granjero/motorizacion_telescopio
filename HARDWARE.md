# Instrucciones de ensamblado

## Azimut

El movimiento en el eje azimutal se realiza gracias a uno de los dos motores paso a paso.
El eje de este motor tiene asociado un _piñón_ de **X** dientes, que se acopla con una _corona_ de **Y** dientes.
Estos valores **X** e **Y**, junto con la cantidad de pasos del motor y la cantidad de microsteps configurados en el ShieldCNC son los que se deben volcar al firmware.

#### Corona AZIMUT

- 400 dientes
- 480mm de diámetro
- 9mm de alto

La corona se debe instalar centrada en la base inferior.
[Vista](/imprimibles/engranajes/corona_instalacion.png).

Este es el [archivo](/imprimibles/engranajes/corona_400_dientes_azimut_LASER.dxf) para realizar el corte laser en MDF de 9mm de ancho, se puede generar una nueva pieza con otros parámetros usando este [sketch](/imprimibles/engranajes/engranajes.scad) de OpenScad.

#### Piñón AZIMUT

- 20 dientes
- 25 mm de diámetro
- 24 mm de alto

El piñon se debe instalar en el vástago del motor con un tornillo y tuerca.
Este es el [archivo](/imprimibles/engranajes/pinon_20_dientes_azimut_3D.stl) para realizar la impresion 3D, se puede generar una nueva pieza con otros parámetros usando este [sketch](/imprimibles/engranajes/engranajes.scad) de OpenScad.

#### Soporte motor AZIMUT

El motor debe ser instalado con su eje paralelo al eje de rotación azimutal del telescopio.
Con este [archivo](/imprimibles/monturas/montura_motor_azimut.stl) se puede realizar la impresion 3D del soporte.
También se puede cortar en metal con este [molde](/imprimibles/monturas/montura_motor_azimut_diy.pdf) _Tener en cuenta que el PDF está en tamaño carta._

#### Motor AZIMUT

1. Conectar los pines del motor al eje **X** del ShieldCNC

## Elevación

#### Motor ELEVACION

aake bonbon lollipop halvah sweet. Marshmallow danish powder cupcake jelly-o bonbon. Sweet pastry jelly halvah apple pie apple pie halvah cake icing

## Arduino + CNC Shield

1. Arduino
   1. Cargar el [firmware](/FIRMWARE.md) en el Arduino
   2. El Arduino será conectado a 12V por el puerto _PowerJack 2.1x5.5mm_  
      <img src="/archivos/arduino_alimentacion.png" width=26% height=26%>
2. ShieldCNC

   1. Popular con jumpers los 3 pares de pines (M0, M1, M2) del eje **X** y del eje **Y** para configurar el MicroStepping en 16.  
      <img src="/archivos/cnc_shield_jumpers.png" width=25% height=25%>
   2. Conectar los drivers de los motores en el ShieldCNC en los headers para los ejes **X** e **Y**. El pin enable del driver debe coincidir con el pin enable del ShieldCNC  
      <img src="/archivos/cnc_shield_enable.png" width=25% height=25%>
   3. Conectar el cable de alimentacion al ShieldCNC  
      <img src="/archivos/cnc_shield_12v.png" width=25% height=25%>
   4. Conectar el ShieldCNC al Arduino
