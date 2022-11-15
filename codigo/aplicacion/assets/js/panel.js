// El objeto PANEL va a tener los datos del panel.
let PANEL = {
  locacion: {
    latitud: 0,
    longitud: 0,
    altitud: 0,
    pais: "",
  },
  objetoCeleste: {
    tipo: "SolarSystem:planet",
    nombre: "Earth",
    azimut: 0,
    elevacion: 0,
  },
};

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
    PANEL.locacion.latitud = datos.location.latitude;
    PANEL.locacion.longitud = datos.location.longitude;
    PANEL.locacion.altitud = datos.location.altitude;
    PANEL.locacion.pais = datos.location.country;

    document.getElementById("LATITUD").setAttribute("value", datos.location.latitude);
    document.getElementById("LONGITUD").setAttribute("value", datos.location.longitude);
    document.getElementById("ALTITUD").setAttribute("value", datos.location.altitude);
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log("error");
  }
  listaTiposObjetosCelestes();
}

// listado de TIPOS de objeto
async function listaTiposObjetosCelestes() {
  listaObjetosCelestes(PANEL.objetoCeleste.tipo);

  const url = "http://localhost:8090/api/objects/listobjecttypes";

  let listaTipoObjetosCelestes = document.getElementById("LISTA_TIPO_OBJETOS");
  var seleccionar = document.createElement("option");
  seleccionar.text = "Seleccione...";
  listaTipoObjetosCelestes.appendChild(seleccionar);
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

// listado de OBJETO segun tipo
async function listaObjetosCelestes() {
  const url = "http://localhost:8090/api/objects/listobjectsbytype?type=" + PANEL.objetoCeleste.tipo;

  let listaObjetosCelestes = document.getElementById("LISTA_OBJETOS");
  listaObjetosCelestes.innerText = "";

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    var seleccionar = document.createElement("option");
    seleccionar.text = "Seleccione...";
    listaObjetosCelestes.appendChild(seleccionar);

    datos.forEach(function (elemento) {
      //console.log(elemento.key);
      var opcion = document.createElement("option");
      opcion.text = elemento;
      opcion.value = elemento;
      listaObjetosCelestes.appendChild(opcion);
    });
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log("error");
  }
}

// selecciona objeto de la lista

// obtiene coordenadas del objeto
// @param string nombre del objeto
//
async function coordenadasObjeto(objeto) {
  const url = "http://localhost:8090/api/objects/info?name=" + objeto + "&format=json";
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

// obtiene coordenadas
async function getCoordenadas() {}
// FUNCIONES PANTALLA
// TODO agregar boton para activar/desactivar
function modoNoche() {
  //var html = document.getElementsByTagName("html")[0]; // '0' to assign the first (and only `HTML` tag)
  var html = document.getElementById("HTML");
  html.classList.contains("modo_noche") ? html.removeAttribute("class", "modo_noche") : html.setAttribute("class", "modo_noche");
}

// setea el nombre del objeto seleccionado en PANEL
function setNombreObjetoPanel(evento) {
  PANEL.objetoCeleste.nombre = evento.target.value;
  const objeto = document.getElementById("OBJETO");
  objeto.innerHTML = evento.target.value;
}

// setea el tipo del objeto seleccionado en PANEL
function setTipoObjetoPanel(evento) {
  PANEL.objetoCeleste.tipo = evento.target.value;
}

// EVENT LISTENERS
const NOCHE = document.querySelector("#NOCHE");
NOCHE.addEventListener("click", modoNoche);

const STELLARIUM = document.querySelector("#STELLARIUM");
STELLARIUM.addEventListener("click", conectar);

const LISTA_OBJETOS = document.querySelector("#LISTA_OBJETOS");
LISTA_OBJETOS.addEventListener("change", setNombreObjetoPanel);

const LISTA_TIPO_OBJETOS = document.querySelector("#LISTA_TIPO_OBJETOS");
LISTA_TIPO_OBJETOS.addEventListener("change", setTipoObjetoPanel);
LISTA_TIPO_OBJETOS.addEventListener("change", listaObjetosCelestes);
