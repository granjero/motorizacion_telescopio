// El objeto PANEL va a tener los datos del panel.
let PANEL = {
  telescopio: {
    latitud: 0,
    longitud: 0,
    altitud: 0,
    pais: "",
    angulo: 1,
    velocidad: 0,
  },
  objeto: {
    tipo: "SolarSystem:planet",
    nombre: "Earth",
    azimut: 0,
    elevacion: 0,
    seguimiento: 0,
  },
};

// FUNCIONES STELLARIUM
// chequea que el servidor de stellarium esté andando
// toma los datos de LAT LONG ALT etc y los pone en PANEL y en el DOM
async function conectar() {
  const url = "http://localhost:8090/api/main/status";
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    //console.log(datos);
    PANEL.telescopio.latitud = datos.location.latitude;
    PANEL.telescopio.longitud = datos.location.longitude;
    PANEL.telescopio.altitud = datos.location.altitude;
    PANEL.telescopio.pais = datos.location.country;

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
  listaObjetosCelestes(PANEL.objeto.tipo);
}

// listado de OBJETO segun tipo
async function listaObjetosCelestes() {
  const url = "http://localhost:8090/api/objects/listobjectsbytype?type=" + PANEL.objeto.tipo;

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

// obtiene coordenadas del objeto
// @param string nombre del objeto
//
async function datosObjeto() {
  const url = "http://localhost:8090/api/objects/info?name=" + PANEL.objeto.nombre + "&format=json";
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Si el objeto está debajo del horizonte pone la elevación en 0
    //console.log(datos);
    if (datos.altitude <= 0) {
      PANEL.objeto.azimut = datos.azimuth;
      PANEL.objeto.elevacion = 0;
    } else {
      PANEL.objeto.azimut = datos.azimuth;
      PANEL.objeto.elevacion = datos.altitude;
    }

    var distKM = parseFloat(datos.distance) * 149597870.7;
    distKM = distKM.toFixed(0);
    var visible = datos.altitude > 0 ? "SI" : "NO";
    var info = '<dl class="row">';
    info += '<dt class="col-4">Visible</dt> <dd class="col-8">' + visible + "</dd>";
    info += '<dt class="col-4">AZ</dt> <dd class="col-8">' + datos.azimuth.toFixed(3) + "&#176;</dd>";
    info += '<dt class="col-4">EL</dt> <dd class="col-8">' + datos.altitude.toFixed(3) + "&#176;</dd>";
    info += '<dt class="col-4">Iluminado</dt> <dd class="col-8">' + datos.illumination.toFixed(2) + " %</dd>";
    info += '<dt class="col-4">Distancia</dt> <dd class="col-8">' + datos.distance.toFixed(4) + " AU</dd>";
    info += '<dt class="col-4">Distancia</dt> <dd class="col-8">' + commify(distKM) + " km</dd>";
    info += "</dl>";

    //console.log(info);
    let objetoInfo = document.getElementById("OBJETO_INFO");
    objetoInfo.innerHTML = info;
    //console.log(datos);
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log("error caca");
  }
}

function angulo() {
  PANEL.telescopio.angulo = document.querySelector('input[name="ANGULO"]:checked').value;
  console.log(PANEL.telescopio.angulo);
}

// FUNCIONES PANTALLA
// TODO agregar boton para activar/desactivar
function modoNoche() {
  //var html = document.getElementsByTagName("html")[0]; // '0' to assign the first (and only `HTML` tag)
  var html = document.getElementById("HTML");
  html.classList.contains("modo_noche") ? html.removeAttribute("class", "modo_noche") : html.setAttribute("class", "modo_noche");
}

// setea el nombre del objeto seleccionado en PANEL
function setNombreObjetoPanel(evento) {
  PANEL.objeto.nombre = evento.target.value;
  const objeto = document.getElementById("OBJETO");
  objeto.innerHTML = evento.target.value;
}

// https://www.codingem.com/comma-thousand-separator-in-javascript/
function commify(n) {
  var parts = n.toString().split(".");

  const numberPart = parts[0];
  const decimalPart = parts[1];
  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return numberPart.replace(thousands, ".") + (decimalPart ? "," + decimalPart : "");
}

// setea el tipo del objeto seleccionado en PANEL
function setTipoObjetoPanel(evento) {
  PANEL.objeto.tipo = evento.target.value;
}

// EVENT LISTENERS
const NOCHE = document.querySelector("#NOCHE");
NOCHE.addEventListener("click", modoNoche);

const STELLARIUM = document.querySelector("#STELLARIUM");
STELLARIUM.addEventListener("click", conectar);

const LISTA_OBJETOS = document.querySelector("#LISTA_OBJETOS");
LISTA_OBJETOS.addEventListener("change", setNombreObjetoPanel);
LISTA_OBJETOS.addEventListener("change", datosObjeto);

const LISTA_TIPO_OBJETOS = document.querySelector("#LISTA_TIPO_OBJETOS");
LISTA_TIPO_OBJETOS.addEventListener("change", setTipoObjetoPanel);
LISTA_TIPO_OBJETOS.addEventListener("change", listaObjetosCelestes);

const SEGUIMIENTO = document.querySelector("#SEGUIMIENTO");
SEGUIMIENTO.addEventListener("click", () => {
  PANEL.objeto.seguimiento = setInterval(datosObjeto, 200);
});

const STOP = document.querySelector("#STOP");
STOP.addEventListener("click", () => {
  clearInterval(PANEL.objeto.seguimiento);
  PANEL.objeto.seguimiento = 0;
});

const ANGULO = document.querySelector("#ANGULO");
ANGULO.addEventListener("click", angulo);
