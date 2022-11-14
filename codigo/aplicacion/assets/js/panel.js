// El objeto PANEL va a tener los datos del panel.
let PANEL = {
    locacion: {
        latitud: 0,
        longitud: 0,
        altitud: 0,
    },
    objetoCeleste: {
        tipo: "",
        nombre: "",
        azimut: 0,
        elevacion: 0,
    },
};

let listaTipoObjetosCelestes = [];

// FUNCIONES STELLARIUM
// esta funcion chequea que el servidor de stellarium esté andando
// toma los datos de LAT LONG y ALT y los pone en el formulario
async function conectar() {
    const url = "http://localhost:8090/api/main/status";
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        // TODO modificar objeto PANEL con los datos que vienen de acá
        console.log(datos);
    } catch (error) {
        //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
        console.log("error");
    }
}

// listado de tipos de objeto
async function getListaTiposObjetosCelestes() {
    const url = "http://localhost:8090/api/objects/listobjecttypes";

    let listaTipoObjetosCelestes =
        document.getElementById("LISTA_TIPO_OBJETOS");
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        datos.forEach(function (elemento) {
            //console.log(elemento.name);
            //console.log(elemento.key);
            var opcion = document.createElement("option");
            opcion.text = elemento.name;
            opcion.value = elemento.key;
            elemento.name == "Planets" // selecciono planetas de una para su mayor confort
                ? (opcion.selected = true)
                : (opcion.selected = false);
            listaTipoObjetosCelestes.appendChild(opcion);
        });
    } catch (error) {
        //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
        console.log("error");
    }
}

// obtiene coordenadas del objeto
// @param string nombre del objeto
//
async function coordenadasObjeto(objeto) {
    const url =
        "http://localhost:8090/api/objects/info?name=" +
        objeto +
        "&format=json";
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.altitude <= 0) {
            PANEL.objetoCeleste.azimut = 0;
            PANEL.objetoCeleste.elevacion = 0;
            PANEL.objetoCeleste.nombre = 0;
            PANEL.objetoCeleste.tipo = 0;
        } else {
            PANEL.objetoCeleste.azimut = datos.azimuth;
            PANEL.objetoCeleste.elevacion = datos.altitude;
            PANEL.objetoCeleste.nombre = datos.name;
            PANEL.objetoCeleste.tipo = datos.type;
        }
        //console.log(datos);
    } catch (error) {
        //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
        console.log("error");
    }
}
// FUNCIONES PANTALLA
// TODO agregar boton para activar/desactivar
function modoNoche() {
    var html = document.getElementsByTagName("html")[0]; // '0' to assign the first (and only `HTML` tag)
    html.setAttribute("class", "modo_noche");
}
