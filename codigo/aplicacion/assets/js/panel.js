// El objeto PANEL va a tener los datos del panel.
let PANEL = {
  telescopio: {
    latitud: 0,
    longitud: 0,
    altitud: 0,
    pais: "",
    distancia_angular: 1,
    velocidad: 0,
  },
  stellarium: {
    online: false,
  },
  objeto: {
    tipo: "SolarSystem:planet",
    nombre: "Earth",
    visible: false,
    azimut: 0,
    elevacion: 0,
    iluminado: 0,
    distancia: 0,
  },
  // TODO rever nombres variables serial
  intervalos: {
    id_seguimiento: 0,
    id_enviar_comando: 0,
  },
};

/* ->->->->->->->->->->->-> */
/* ->->->->->->->->->->->-> */
/* ->->->->->->->->->->->-> */

// FUNCIONES STELLARIUM
// API main status
async function stellarium_main_status() {
  const url = "http://localhost:8090/api/main/status";
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    PANEL.telescopio.latitud = datos.location.latitude;
    PANEL.telescopio.longitud = datos.location.longitude;
    PANEL.telescopio.altitud = datos.location.altitude;
    PANEL.telescopio.pais = datos.location.country;
    PANEL.stellarium.online = true;
    return true;
  } catch (error) {
    //TODO  link a instrucciones para setear stellarium
    panel_mensaje("No se pudo conectar con STELLARIUM!", "Iniciar Stellarium y Activar el Plugin Remote Control");
    console.log("error stellarium_main_status");
    return false;
  }
}

// obtiene los datos del objeto seleccionado y los pone en PANEL
async function stellarium_object_info() {
  const url = "http://localhost:8090/api/objects/info?name=" + PANEL.objeto.nombre + "&format=json";
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Si el objeto está debajo del horizonte pone la elevación en 90
    if (datos.altitude <= 5) {
      PANEL.objeto.visible = false;
    } else {
      PANEL.objeto.visible = true;
    }
    PANEL.objeto.azimut = datos.azimuth.toFixed(4);
    PANEL.objeto.elevacion = datos.altitude.toFixed(4);
    PANEL.objeto.iluminado = "illumination" in datos ? datos.illumination.toFixed(2) : false;
    PANEL.objeto.distancia = "distance" in datos ? datos.distance.toFixed(4) : false;
    //console.log(PANEL.objeto.azimut);
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log(error);
  }
}

// setea la locación
async function stellarium_set_locacion() {
  //let latitud = document.getElementById("LATITUD").value;
  //let longitud = document.getElementById("LONGITUD").value;
  //let altitud = document.getElementById("ALTITUD").value;
  const locacion = panel_get_locacion();
  console.log(locacion);
  const url =
    "http://localhost:8090/api/location/setlocationfields?latitude=" +
    locacion.latitud +
    "&longitude=" +
    locacion.longitud +
    "&altitude=" +
    locacion.altitud;
  console.log(url);
  try {
    fetch(url, {
      method: "POST",
    });
  } catch (error) {
    console.log("Error set locacion");
  }
}

// actualiza locacion con datos de PANEL
function panel_imprime_locacion() {
  document.getElementById("LATITUD").setAttribute("value", PANEL.telescopio.latitud);
  document.getElementById("LONGITUD").setAttribute("value", PANEL.telescopio.longitud);
  document.getElementById("ALTITUD").setAttribute("value", PANEL.telescopio.altitud);
  return true;
}

// actualiza la lista de tipos de elementos celeste
async function panel_imprime_lista_tipos_objetos_celestes() {
  const url = "http://localhost:8090/api/objects/listobjecttypes";
  let listaTipoObjetosCelestes = document.getElementById("LISTA_TIPO_OBJETOS");
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    datos.forEach(function (elemento) {
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
    console.log("error lista Tipo Objetos Celestes");
  }
}

// actualiza la lista de objeto celestes
async function panel_imprime_lista_objetos_celestes() {
  const url = "http://localhost:8090/api/objects/listobjectsbytype?type=" + PANEL.objeto.tipo;

  let listaObjetosCelestes = document.getElementById("LISTA_OBJETOS");
  listaObjetosCelestes.innerText = ""; // vacia la lista

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    datos.forEach(function (elemento) {
      var opcion = document.createElement("option");
      opcion.text = elemento;
      opcion.value = elemento;
      listaObjetosCelestes.appendChild(opcion);
    });
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log("error lista objetos");
  }
}

// actualiza los valores del objeto seleccionado
function panel_imprime_objeto_seleccionado() {
  try {
    var visible = PANEL.objeto.visible ? "SI" : "NO";
    var info = '<dl class="row">';
    info += '<dt class="col-4">Visible</dt> <dd class="col-8">' + visible + "</dd>";
    info += '<dt class="col-4">AZ</dt> <dd class="col-8">' + PANEL.objeto.azimut + "&#176;</dd>";
    info += '<dt class="col-4">EL</dt> <dd class="col-8">' + PANEL.objeto.elevacion + "&#176;</dd>";
    if (PANEL.objeto.iluminado) info += '<dt class="col-4">Iluminado</dt> <dd class="col-8">' + PANEL.objeto.iluminado + " %</dd>";
    if (PANEL.objeto.distancia) info += '<dt class="col-4">Distancia</dt> <dd class="col-8">' + PANEL.objeto.distancia + " AU</dd>";
    if (PANEL.objeto.distancia) info += '<dt class="col-4">Distancia</dt> <dd class="col-8">' + commify(ua_a_km()) + " km</dd>";

    info += "</dl>";

    //console.log(info);
    let objetoInfo = document.getElementById("OBJETO_INFO");
    objetoInfo.innerHTML = info;
    const objeto = document.getElementById("OBJETO");
    objeto.innerHTML = PANEL.objeto.nombre;
    //console.log(datos);
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log(error);
  }
}

function panel_get_tipo_objeto_seleccionado() {
  PANEL.objeto.tipo = document.querySelector("#LISTA_TIPO_OBJETOS option:checked").value;
}

function panel_get_nombre_objeto_seleccionado() {
  //PANEL.objeto.nombre = document.getElementById("LISTA_OBJETOS");
  PANEL.objeto.nombre = document.querySelector("#LISTA_OBJETOS option:checked").value;
}

// setea la distancia angular en PANEL
function panel_get_distancia_angular() {
  PANEL.telescopio.distancia_angular = document.querySelector('input[name="ANGULO"]:checked').value;
}

// agrega la clase modo noche al tag html
function panel_modo_noche() {
  var html = document.getElementById("HTML");
  html.classList.contains("modo_noche") ? html.removeAttribute("class", "modo_noche") : html.setAttribute("class", "modo_noche");
}

// chequea que estemos conectados a STELLARIUM
function panel_stellarium_online() {
  let STELLARIUM = document.getElementById("STELLARIUM");
  if (PANEL.stellarium.online) {
    STELLARIUM.innerHTML = '<i class="me-2 fa-solid fa-star"></i>STELLARIUM conectado<i class="mx-2 fa-solid fa-thumbs-up"></i>';
    STELLARIUM.classList.add("disabled");
  }
}

// transforma UA a Km
function ua_a_km() {
  var distKM = parseFloat(PANEL.objeto.distancia) * 149597870.7;
  distKM = distKM.toFixed(0);
  return distKM;
}

// https://www.codingem.com/comma-thousand-separator-in-javascript/
function commify(n) {
  var parts = n.toString().split(".");
  const numberPart = parts[0];
  const decimalPart = parts[1];
  const thousands = /\B(?=(\d{3})+(?!\d))/g;
  return numberPart.replace(thousands, ".") + (decimalPart ? "," + decimalPart : "");
}

// Locacion
// TODO pasar valore a PANEL
function panel_get_locacion() {
  let latitud = document.getElementById("LATITUD").value;
  let longitud = document.getElementById("LONGITUD").value;
  let altitud = document.getElementById("ALTITUD").value;

  longitud = longitud < -180 || longitud > 180 ? 0 : longitud;
  latitud = latitud < -90 || latitud > 90 ? 0 : latitud;
  altitud = altitud < -400 || altitud > 5000 ? 0 : altitud;

  return { latitud: latitud, longitud: longitud, altitud: altitud };
}

// GOTO
function panel_get_go_to() {
  let azimut = document.getElementById("AZIMUT").value;
  let elevacion = document.getElementById("ELEVACION").value;

  azimut = azimut <= 0 || azimut >= 360 ? 0 : azimut;
  elevacion = elevacion <= 0 || elevacion >= 90 ? 90 : elevacion;

  PANEL.objeto.azimut = azimut;
  PANEL.objeto.elevacion = elevacion;
}

function panel_mensaje(negrita, normal) {
  let mensaje = '<div class="alert alert-info alert-dismissible fade show" role="alert">';
  mensaje += "<strong>";
  mensaje += negrita;
  mensaje += "</strong>";
  mensaje += normal;
  mensaje += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  let MENSAJE = document.getElementById("MENSAJE");
  MENSAJE.innerHTML = mensaje;
}
// setear home ceros
function telescopio_set_home() {
  serial_enviar_comando("SET_HOME");
}

// ->->->->->->->
// SERIAL WEB API
// ->->->->->->->

async function serial_conectar_telescopio() {
  port = await navigator.serial.requestPort({});
  await port.open({ baudRate: 115200 });

  //document.querySelector("input").disabled = false;
  TELESCOPIO.innerText = "🔌 Desconectar Telescopio";

  const encoder = new TextEncoderStream();
  outputDone = encoder.readable.pipeTo(port.writable);
  outputStream = encoder.writable;
}

async function serial_go_to() {
  try {
    if (port) {
      let comando = "SEG ";
      comando += PANEL.objeto.azimut;
      comando += " ";
      comando += PANEL.objeto.elevacion;
      comando += " \r\n";

      const writer = outputStream.getWriter();
      console.log("[SEND]", comando);
      writer.write(comando);
      writer.releaseLock();
    } else {
      console.log("ERROR PORT GOTO");
      panel_mensaje("No se pudo conectar con el TELESCOPIO!", "Error en GO_TO");
      boton_stop();
    }
  } catch (error) {
    console.log(error);
  }
}
async function serial_enviar_comando(comando) {
  try {
    if (port) {
      const writer = outputStream.getWriter();
      console.log("[SEND]", comando);
      writer.write(comando);
      writer.releaseLock();
    } else {
      console.log("ERROR PORT SERIAL ENVIAR COMANDO");
      panel_mensaje("No se pudo conectar con el TELESCOPIO!  ", "Error al enviar el comando [" + comando + "]");
    }
  } catch (error) {
    console.log(error);
  }
}

// EVENT LISTENERS

const TELESCOPIO = document.getElementById("TELESCOPIO");
let port;
TELESCOPIO.addEventListener("click", function () {
  if (port) {
    port.close();
    port = undefined;
    TELESCOPIO.innerText = "🔌 Conectar con el Telescopio";
  } else {
    serial_conectar_telescopio();
  }
});

const NOCHE = document.querySelector("#NOCHE");
NOCHE.addEventListener("click", panel_modo_noche);

// Click en el botón de conectar a STELLARIUM
const STELLARIUM = document.querySelector("#STELLARIUM");
STELLARIUM.addEventListener("click", boton_STELLARIUM);
async function boton_STELLARIUM() {
  await stellarium_main_status();
  panel_stellarium_online();
  panel_imprime_locacion();
  await panel_imprime_lista_tipos_objetos_celestes();
  await panel_imprime_lista_objetos_celestes();
}

// seleccion de objeto
const LISTA_OBJETOS = document.querySelector("#LISTA_OBJETOS");
LISTA_OBJETOS.addEventListener("change", seleccion_lista_objetos);
async function seleccion_lista_objetos() {
  panel_get_nombre_objeto_seleccionado();
  await stellarium_object_info();
  panel_imprime_objeto_seleccionado();
}
// seleccion tipo de objeto
const LISTA_TIPO_OBJETOS = document.querySelector("#LISTA_TIPO_OBJETOS");
LISTA_TIPO_OBJETOS.addEventListener("change", seleccion_lista_tipo_objetos);
async function seleccion_lista_tipo_objetos() {
  panel_get_tipo_objeto_seleccionado();
  await panel_imprime_lista_objetos_celestes();
}

// click en la navecita de seguimiento
const SEGUIMIENTO = document.querySelector("#SEGUIMIENTO");
SEGUIMIENTO.addEventListener("click", boton_seguimiento);
async function boton_seguimiento() {
  PANEL.intervalos.id_seguimiento =
    PANEL.intervalos.id_seguimiento == 0
      ? setInterval(async function i() {
          await stellarium_object_info(), panel_imprime_objeto_seleccionado(), serial_go_to();
        }, 300)
      : PANEL.intervalos.id_seguimiento;
}

// click en la mano
const STOP = document.querySelector("#STOP");
STOP.addEventListener("click", boton_stop);
function boton_stop() {
  clearInterval(PANEL.intervalos.id_seguimiento);
  PANEL.intervalos.id_seguimiento = 0;
  serial_enviar_comando("STOP \r\n");
}

// click en la casita GO HOME
const GO_HOME = document.querySelector("#GO_HOME");
GO_HOME.addEventListener("click", boton_go_home);
function boton_go_home() {
  serial_enviar_comando("GO_HOME \r\n");
}

// click en el boton de apagado
const OFF = document.querySelector("#OFF");
OFF.addEventListener("click", boton_off);
function boton_off() {
  clearInterval(PANEL.intervalos.id_seguimiento);
  PANEL.intervalos.id_seguimiento = 0;
  serial_enviar_comando("OFF \r\n");
}

// click en el mundito de setear ceros
const SET_HOME = document.querySelector("#SET_HOME");
SET_HOME.addEventListener("click", boton_set_home);
function boton_set_home() {
  serial_enviar_comando("SET_HOME \r\n");
}

const ANGULO = document.querySelector("#ANGULO");
ANGULO.addEventListener("click", panel_get_distancia_angular);

// click en el boton UP
const UP = document.querySelector("#UP");
UP.addEventListener("click", boton_up);
function boton_up() {
  let comando = "ELa ";
  comando += PANEL.telescopio.distancia_angular;
  comando += " \r\n";
  serial_enviar_comando(comando);
}

// click en el boton DOWN
const DOWN = document.querySelector("#DOWN");
DOWN.addEventListener("click", boton_down);
function boton_down() {
  let comando = "ELa -";
  comando += PANEL.telescopio.distancia_angular;
  comando += " \r\n";
  serial_enviar_comando(comando);
}

// click en el boton LEFT
const LEFT = document.querySelector("#LEFT");
LEFT.addEventListener("click", boton_left);
function boton_left() {
  let comando = "AZa -";
  comando += PANEL.telescopio.distancia_angular;
  comando += " \r\n";
  serial_enviar_comando(comando);
}

// click en el boton RIGHT
const RIGHT = document.querySelector("#RIGHT");
RIGHT.addEventListener("click", boton_right);
function boton_right() {
  let comando = "AZa ";
  comando += PANEL.telescopio.distancia_angular;
  comando += " \r\n";
  serial_enviar_comando(comando);
}

const GOTO = document.querySelector("#GOTO");
GOTO.addEventListener("click", boton_go_to);
function boton_go_to() {
  panel_get_go_to();
  serial_go_to();
}
