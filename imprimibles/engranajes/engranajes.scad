/**********************************************
Engranajes para motorizacion montura dobson.
Diseño de la montura basado en el de la 
Asociacón de Amigos de la Astronomía
(https://www.amigosdelaastronomia.org/)

Softare libre.
***********************************************/

include <gears.scad> // https://github.com/chrisspen/gears

DIAMETRO_BASE_MONTURA = 480; // medida de la base de la montura en milimetros.

MODULO = 1.1185; // modificar este valor segun corresponda para que el valor de "Ring Gear Outer Diamater" que se lee al ejecutar el programa sea lo más cercano al diametro de la base de la montura en milimetros.  


// En teoría no haría falta modificar las variables de más abajo

// PARAMETROS CORONA
DIAMETRO_CORONA = DIAMETRO_BASE_MONTURA; 
CANT_DIENTES_CORONA = 400;
ALTO_CORONA = 15;
ANCHO_CORONA = 15; // esta variable modifica el valor de "Ring Gear Outer Diamater" 
PARTES = 6; // CANTIDAD DE PARTES EN LA QUE SE DIVIDIRA LA CORONA PARA IMPRIMIR 3D
TORNILLOS = 8; // CANTIDAD DE ORIFICIOS EN LA CORONA PARTIDA PARA IMPRIMIR

// PARAMETROS PIÑON
CANT_DIENTES_PINON = 20;
ALTO_PINON = 15;
ANCHO_EJE_MOTOR = 5.5;
DIAMETRO_ANCLAJE_PINON = 18.5;

// PARAMETROS REDUCCION
CANT_DIENTES_REDUCCION_CORONA = 100;
CANT_DIENTES_REDUCCION_PINON = 20;
ALTO_REDUCCION_CORONA = 10;
ALTO_REDUCCION_PINON = 20;
ANCHO_EJE_REDUCCION = 5;


// COMENTAR O DESCOMENTAR SEGUN CORRESPONDA
/*baseMontura(); // comentar al hacer el render para imprimir*/

//coronaCompleta(); // comentar al hacer el render para imprimir  
//coronaDivididaEnPartes(); // comentar al hacer el render para imprimir
//orificiosParaTornillos (); // comentar al hacer el render para imprimir

/*coronaPara3D();*/

/*pinonPara3D();*/

reduccionPara3D();

//
// CORONA
//

// Dibuja la base de la montura para una referencia visual
// color => color para el render
module baseMontura(color = "Indigo")
{
    translate([0,0,-25])
    color(color, 0.4) {
        union(){
            cylinder(h = 18, r = DIAMETRO_CORONA / 2,center = true);
        }
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
    altoAnclajeEje = 20;
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
                cylinder(h = ALTO_PINON + altoAnclajeEje, d = DIAMETRO_ANCLAJE_PINON);
            }
            // hueco para el eje del motor
            cylinder(h = ALTO_PINON + altoAnclajeEje, d = ANCHO_EJE_MOTOR);
        }
        // huecos para los tornillos 
        translate([0,0,ALTO_PINON + altoAnclajeEje * 0.25 ])
        rotate([0,90,0])
        cylinder(h =20, d = 3.5);
        translate([0,0,ALTO_PINON + altoAnclajeEje * 0.75])
        rotate([0,90,0])
        cylinder(h =20, d = 3.5);
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
