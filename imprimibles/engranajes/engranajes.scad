/**********************************************
Engranajes para motorizacion montura dobson.
Diseño de la montura basado en el de la 
Asociacón de Amigos de la Astronomía
(https://www.amigosdelaastronomia.org/)

Softare libre.
***********************************************/

include <gears.scad> // https://github.com/chrisspen/gears
// definicion
$fn = 200;
// CORONA 3D
CORONA_PARA_IMPRIMIR_3D = false;
// CORONA COMPLETA
CORONA_COMPLETA = true;
// PINON 3D
PINON_PARA_IMPRIMIR_3D = false;
// ver base 
BASE_MONTURA = true;




// Diametro de la base de la montura
DIAMETRO_BASE_MONTURA = 480; // medida de la base de la montura en milimetros.

// modulo del engranaje
// modificar este valor segun corresponda para que el valor de "Ring Gear Outer Diamater" que se lee al ejecutar el programa sea lo más cercano al diametro de la base de la montura en milimetros.  

// Modulo del engranaje 
MODULO = 1.1185; // [0.1:0.001:2]


// PARAMETROS CORONA
DIAMETRO_CORONA = DIAMETRO_BASE_MONTURA; 
// AZIMUT Cantidad de dientes de la corona 
CANT_DIENTES_CORONA = 400;
// AZIMUT para impresion 3D
ALTO_CORONA = 15;
// AZIMUT para impresion 3D
ANCHO_CORONA = 15; // esta variable modifica el valor de "Ring Gear Outer Diamater" 
// AZIMUT cantidad porciones de la corona para impresion 3D
PARTES = 8; // CANTIDAD DE PARTES EN LA QUE SE DIVIDIRA LA CORONA PARA IMPRIMIR 3D
// AZIMUT cantidad de orificios
TORNILLOS = 8; // CANTIDAD DE ORIFICIOS EN LA CORONA PARTIDA PARA IMPRIMIR

// PARAMETROS PIÑON
// AZIMUT Cantidad de dientes del piñon
CANT_DIENTES_PINON = 20;
// para impresion 3D
ALTO_PINON = 17;
ALTO_ANCLAJE_PINION = 7;
ANCHO_EJE_MOTOR = 5.35;
DIAMETRO_ANCLAJE_PINON = 25;


module esconde_variables_del_customizer (){}

// En teoría no haría falta modificar las variables de más abajo


// PARAMETROS REDUCCION
CANT_DIENTES_REDUCCION_CORONA = 100;
CANT_DIENTES_REDUCCION_PINON = 20;
ALTO_REDUCCION_CORONA = 10;
ALTO_REDUCCION_PINON = 20;
ANCHO_EJE_REDUCCION = 5;


// COMENTAR O DESCOMENTAR SEGUN CORRESPONDA
if(BASE_MONTURA){
  baseMontura(); // comentar al hacer el render para imprimir
}
if (CORONA_COMPLETA){
  coronaCompleta(); // comentar al hacer el render para imprimir  
}
//coronaDivididaEnPartes(); // comentar al hacer el render para imprimir
//orificiosParaTornillos (); // comentar al hacer el render para imprimir
if(CORONA_PARA_IMPRIMIR_3D){
  coronaPara3D();
}
if(PINON_PARA_IMPRIMIR_3D){
  pinonPara3D();
}

/*reduccionPara3D();*/

//
// CORONA
//

// Dibuja la base de la montura para una referencia visual
// color => color para el render
module baseMontura(color = "Indigo")
{
    translate([0,0,-9])
    color(color, 4) {
        union(){
            cylinder(h = 18, r = DIAMETRO_CORONA / 1.94,center = true);
        }
    }

    // tapa
    translate([0,0,30])
    color("Purple", 4) {
      difference(){
        cylinder(h = 18, r = DIAMETRO_CORONA / 1.94,center = true);
        translate([DIAMETRO_CORONA / 2.35, 0,0])
        cylinder(h=30, r = 25, center = true);
        translate([DIAMETRO_CORONA / 2.3, 0,0])
        cylinder(h=30, r = 25, center = true);
      }
    }
    // soporte
    translate([DIAMETRO_CORONA / 2.05,-45,40])
    rotate([0,0,90])
    soporte();

    translate([DIAMETRO_CORONA / 2.24,0,46])
    color("CornflowerBlue")
    {
      motor_cuerpo();
    }

    translate([DIAMETRO_CORONA / 2.27 , 0, 7])
    color("Green"){
      pinonPara3D();
    }
}

// Dibuja la corona completa. Sólo para visualizar.
module coronaCompleta()
{
    ring_gear (
        modul=MODULO, 
        tooth_number=CANT_DIENTES_CORONA, 
        width=ALTO_CORONA, 
        rim_width=ANCHO_CORONA, 
        pressure_angle=20, 
        helix_angle=0);
}

// Divide la corona en partes
module coronaDivididaEnPartes() 
{
    difference()
    {
        coronaCompleta();

        rotate_extrude(angle = 360 - (360 / PARTES), convexity = 10)
        translate([DIAMETRO_CORONA/2, 0, 0])
        circle(r = 50);
    }
}

// Hace los orificios para montar la corona en la base con tornillos
module orificiosParaTornillos ()
{
    for(i = [0 : TORNILLOS])
    {
        rotate([0,0,-i*360/PARTES/TORNILLOS])
        translate([DIAMETRO_CORONA/2-ANCHO_CORONA/2, 0,0])
        cylinder(h = ALTO_CORONA*2, d = 4 );
    }
}

// Hace el render de la corona cortada en las partes necesarias para imprimir en 3D
module coronaPara3D ()
{
    difference(){
        coronaDivididaEnPartes();
        orificiosParaTornillos();
    }
}

//
// PIÑON
//

module pinonPara3D()
{
    difference()
    {
        difference()
        {
            union()
            {
                spur_gear (
                        modul=MODULO, 
                        tooth_number=CANT_DIENTES_PINON, 
                        width=ALTO_PINON, 
                        bore=ANCHO_EJE_MOTOR, 
                        pressure_angle=20, 
                        helix_angle=0, 
                        optimized=true);
                translate([0,0,ALTO_PINON])
                cylinder(h = ALTO_ANCLAJE_PINION, d = DIAMETRO_ANCLAJE_PINON);
            }
            // hueco para el eje del motor
            cylinder(h = ALTO_PINON + ALTO_ANCLAJE_PINION, d = ANCHO_EJE_MOTOR);
        }
        // hueco para el tornillo de anclaje 
        translate([0,0,ALTO_PINON + ALTO_ANCLAJE_PINION * 0.5])
        rotate([0,90,0])
        cylinder(h =20, d = 3);
    translate([DIAMETRO_ANCLAJE_PINON*.2,-3, (-4 + ALTO_PINON + ALTO_ANCLAJE_PINION * .5)])
    cube([3, 6, 20]); // tuerca
    }

}

//
// REDUCCION
//

module reduccionPara3D()
{

    translate([0,0,ALTO_REDUCCION_CORONA])
    rotate([180])
    spur_gear (
            modul=MODULO, 
            tooth_number=CANT_DIENTES_REDUCCION_CORONA, 
            width=ALTO_REDUCCION_CORONA, 
            bore=ANCHO_EJE_REDUCCION, 
            pressure_angle=20, 
            helix_angle=0, 
            optimized=true);
    translate([0,0,ALTO_REDUCCION_CORONA])
    spur_gear (
            modul=MODULO, 
            tooth_number=CANT_DIENTES_REDUCCION_PINON, 
            width=ALTO_REDUCCION_PINON, 
            bore=ANCHO_EJE_REDUCCION, 
            pressure_angle=20, 
            helix_angle=0, 
            optimized=true);
    // huecos para los tornillos 

}


module soporte()
{
  $fn = 100;

  color("Blue"){
    espesor = 5;
    ancho = 40; 
    largo = 90;
    separacionTornillos = 31;


    difference(){
        difference(){
            cube([largo, ancho, espesor]);
            translate([largo * 0.5, ancho * 0.5, 0])
            cylinder(h = espesor*3, d = 23, center = true); 
        }

        // tornillos
        //----------
        translate(
            [(largo * 0.5) - (separacionTornillos * 0.5),
            (ancho * 0.5) - (separacionTornillos * 0.5),
            0])
        cylinder(h = 30, d = 3, center = true);
            
        translate(
            [(largo * 0.5) + (separacionTornillos * 0.5),
            (ancho * 0.5) - (separacionTornillos * 0.5),
            0])
        cylinder(h = 30, d = 3, center = true);

        translate(
            [(largo * 0.5) - (separacionTornillos * 0.5),
            (ancho * 0.5) + (separacionTornillos * 0.5),
            0])
        cylinder(h = 30, d = 3, center = true);

        translate(
            [(largo * 0.5) + (separacionTornillos * 0.5),
            (ancho * 0.5) + (separacionTornillos * 0.5),
            0])
        cylinder(h = 30, d = 3, center = true);

        // aletas
        // ------

        translate(
            [12, 
            (ancho * 0.5 - ancho * 0.4),
            -3])
        cube([3, ancho * 0.8, 10]);

        translate(
            [largo -14, 
            (ancho * 0.5 - ancho * 0.4),
            -3])
        cube([3, ancho * 0.8, 10]);
    }
  }
}


module motor_cuerpo(alto = 48, ancho = 42.6)
{
    esquina = 6;
    separacionTornillos = 31;
    
    translate([0,0, alto/2])
    difference()
    {
        cube([ancho, ancho, alto], center = true);
         
        // esquinas
        translate([ancho/2,ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto * 1.5], center = true);

        translate([ancho/2,-ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto * 1.5], center = true);

        translate([-ancho/2,ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto * 1.5], center = true);

        translate([-ancho/2,-ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto * 1.5], center = true);
    }
}
