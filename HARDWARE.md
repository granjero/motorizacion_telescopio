# Instrucciones de ensamblado

## Arduino + CNC Shield

1. Arduino
   1. Cargar el [firmware](/FIRMWARE.md) en el Arduino
   2. Preparar el Arduino para ser conectado a 12V por el puerto _PowerJack 2.1x5.5mm_
2. ShieldCNC

   1. Popular con jumpers los 3 pares de pines (M0, M1, M2) del eje **X** y del eje **Y** para configurar el MicroStepping en 16.  
      <img src="/archivos/cnc_shield_jumpers.png" width=25% height=25%>
   2. Conectar los drivers de los motores en el ShieldCNC en los headers para los ejes **X** e **Y**. El pin enable del driver debe coincidir con el pin enable del ShieldCNC  
      <img src="/archivos/cnc_shield_enable.png" width=25% height=25%>
   3. Conectar el cable de alimentacion al ShieldCNC  
      <img src="/archivos/cnc_shield_12v.png" width=25% height=25%>
   4. Conectar el ShieldCNC al Arduino

## Azimut

Cheesecake dessert wafer bear claw pudding. Shortbread cake gingerbread sesame snaps jelly-o muffin sweet carrot cake

### Motor AZIMUT

1. Conectar los pines del motor al eje **X** del ShieldCNC

### Motor ELEVACION

### Elevación

Cake bonbon lollipop halvah sweet. Marshmallow danish powder cupcake jelly-o bonbon. Sweet pastry jelly halvah apple pie apple pie halvah cake icing
