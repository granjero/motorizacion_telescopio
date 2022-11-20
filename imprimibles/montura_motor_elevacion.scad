$fn = 200;


alto_motor = 48;
ancho_motor = 42.6;
espesor_montura = 5;
    
soporte(ancho_motor, alto_motor, espesor_montura);

/*
difference()
{
    soporte(ancho_motor, alto_motor, espesor_montura);
    motor_cuerpo(alto_motor);
}

/*
difference()
{
    union(){
        
    translate([0,0,(alto_motor+espesor_montura)/2])
    cube(alto_motor+espesor_montura, center = true);
    translate([0,0,alto_motor+(espesor_montura/2)])
    cube([53, 93, 5], center = true);

    }

    translate([-20, 35, 20])
    cube([40, 5, 50]);
    translate([-20, -40, 20])
    cube([40, 5, 50]);
    motor_medio(alto_motor+espesor_montura);
    translate([0, -15, 40])
    cube([40, 30, 20]);

}
*/
    

/*

difference()
{
    union()
    {
        translate([0,0,53/2])
        cube(53, center = true);
        translate([0,0,50])
        cube([53, 93, 5], center = true);
    }
    
    motor_medio(53);

}
motor_top(5);
translate([0,0,50])
cube([53, 93, 5], center = true);
*/

/*
motor_top(5);
translate([0,0,5])
motor_medio(48);
*/

module soporte (ancho, alto, espesor)
{
    solapa = 33;
    esquina = 6;
    separacionTornillos = 31;

    difference()
    {
        difference()
        {
            translate([0,0,(alto+espesor)/2])
            cube([ancho + espesor * 2, ancho + espesor * 2, alto + espesor], center = true);
            motor_cuerpo(alto, ancho);
        }    

        // vastago
        translate([0, 0, (alto+espesor)/2])
        cylinder(h = alto + espesor, d = 25, center = true);
         
        // tornillos
        translate([separacionTornillos/2, separacionTornillos/2, (alto+espesor)/2])
        cylinder(h = alto + espesor, d = 3, center = true);
        translate([-separacionTornillos/2, separacionTornillos/2, (alto+espesor)/2])
        cylinder(h = alto + espesor, d = 3, center = true);
        translate([separacionTornillos/2, -separacionTornillos/2, (alto+espesor)/2])
        cylinder(h = alto + espesor, d = 3, center = true);
        translate([-separacionTornillos/2, -separacionTornillos/2, (alto+espesor)/2])
        cylinder(h = alto + espesor, d = 3, center = true);
        
        //enchufe
        translate([0,0, 5])
        cube([20, ancho * 2, 10], center = true);
    } 

    difference()
    {
        translate([ancho/2 + solapa/2, 0,espesor/2])    
        cube([solapa, ancho + espesor * 2, espesor], center = true);

        translate([ancho/2 + solapa/2 + espesor, 0,espesor/2])    
        cube([espesor, ancho * .8, espesor], center = true);
    }
    difference()
    {
        translate([-ancho/2 - solapa/2, 0,espesor/2])    
        cube([solapa, ancho + espesor * 2, espesor], center = true);

        translate([-ancho/2 - solapa/2 - espesor, 0,espesor/2])    
        cube([espesor, ancho * .8, espesor], center = true);

    }
    
    
        
}


module motor_top(alto, ancho)
{
    //alto = 5;
    //ancho = 42;
    esquina = 6;
    separacionTornillos = 31;
    
    translate([0,0, alto/2])
    difference()
    {
        cube([ancho, ancho, alto], center = true);
         
        // vastago
        cylinder(h = 5, d = 25, center = true);
         
        // tornillos
        translate([separacionTornillos/2, separacionTornillos/2, 0])
        cylinder(h = 10, d = 3, center = true);
        translate([-separacionTornillos/2, separacionTornillos/2, 0])
        cylinder(h = 10, d = 3, center = true);
        translate([separacionTornillos/2, -separacionTornillos/2, 0])
        cylinder(h = 10, d = 3, center = true);
        translate([-separacionTornillos/2, -separacionTornillos/2, 0])
        cylinder(h = 10, d = 3, center = true);
         
        // esquinas
        translate([ancho/2,ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);

        translate([ancho/2,-ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);

        translate([-ancho/2,ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);

        translate([-ancho/2,-ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);
    }
}

module motor_cuerpo(alto, ancho)
{
    
    //ancho = 42;
    esquina = 6;
//    alto = 4;
    separacionTornillos = 31;
    
    translate([0,0, alto/2])
    difference()
    {
        cube([ancho, ancho, alto], center = true);
         
        // esquinas
        translate([ancho/2,ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);

        translate([ancho/2,-ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);

        translate([-ancho/2,ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);

        translate([-ancho/2,-ancho/2,0])
        rotate([0,0,45])
        cube([esquina, esquina, alto], center = true);
    }
}