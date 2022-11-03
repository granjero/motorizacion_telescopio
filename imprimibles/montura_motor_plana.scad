$fn = 100;

espesor = 3;
ancho = 40; 
largo = 60;
separacionTornillos = 31;


difference(){

//-------------
    difference(){
        cube([largo, ancho, espesor]);
        translate([largo * 0.5, ancho * 0.5, 0])
        cylinder(h = espesor*3, d = 23, center = true); 
    }
//-------------

//-------------
    translate(
        [(largo * 0.5) - (separacionTornillos * 0.5),
        (ancho * 0.5) - (separacionTornillos * 0.5),
        0])
    cylinder(h = 100, d = 3, center = true);
        
    translate(
        [(largo * 0.5) + (separacionTornillos * 0.5),
        (ancho * 0.5) - (separacionTornillos * 0.5),
        0])
    cylinder(h = 100, d = 3, center = true);

    translate(
        [(largo * 0.5) - (separacionTornillos * 0.5),
        (ancho * 0.5) + (separacionTornillos * 0.5),
        0])
    cylinder(h = 100, d = 3, center = true);

    translate(
        [(largo * 0.5) + (separacionTornillos * 0.5),
        (ancho * 0.5) + (separacionTornillos * 0.5),
        0])
    cylinder(h = 100, d = 3, center = true);
//-------------



    translate(
        [6, 
        (ancho * 0.5 - ancho * 0.4),
        0])
    cube([3, ancho * 0.8, 10]);

   



    translate(
        [largo -8, 
        (ancho * 0.5 - ancho * 0.4),
        0])
    cube([3, ancho * 0.8, 10]);
    
  
}



