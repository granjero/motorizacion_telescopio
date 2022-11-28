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
  serial: {
    seguimiento: 0,
    intervalo: 0,
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
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
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
    PANEL.objeto.azimut = datos.azimuth;
    PANEL.objeto.elevacion = datos.altitude;
    PANEL.objeto.iluminado = "illumination" in datos ? datos.illumination.toFixed(2) : false;
    PANEL.objeto.distancia = "distance" in datos ? datos.distance.toFixed(4) : false;
  } catch (error) {
    //TODO mostrar el error en pantalla y link a instrucciones para setear stellarium
    console.log(error);
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
    info += '<dt class="col-4">AZ</dt> <dd class="col-8">' + PANEL.objeto.azimut.toFixed(4) + "&#176;</dd>";
    info += '<dt class="col-4">EL</dt> <dd class="col-8">' + PANEL.objeto.elevacion.toFixed(4) + "&#176;</dd>";
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
function panel_get_nombre_objeto() {
  //PANEL.objeto.nombre = document.getElementById("LISTA_OBJETOS");
  PANEL.objeto.nombre = document.querySelector("#LISTA_OBJETOS option:checked").value;
}

// setea la distancia angular en PANEL
function panel_get_distancia_angular() {
  PANEL.telescopio.angulo = document.querySelector('input[name="ANGULO"]:checked').value;
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
    STELLARIUM.innerHTML = '<i class="me-2 fa-solid fa-star"></i>STELLARIUM conectado';
    STELLARIUM.classList.add("disabled");
    //clearInterval(intervalo_stellarium_online);
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
function panel_get_locacion() {
  let latitud = document.getElementById("LATITUD").value;
  let longitud = document.getElementById("LONGITUD").value;
  let altitud = document.getElementById("ALTITUD").value;

  longitud = longitud < -180 || longitud > 180 ? 0 : longitud;
  latitud = latitud < -90 || latitud > 90 ? 0 : latitud;
  altitud = altitud < -400 || altitud > 5000 ? 0 : latitud;

  return [latitud, longitud, altitud];
}

// GOTO
function panel_get_go_to() {
  let azimut = document.getElementById("AZIMUT").value;
  let elevacion = document.getElementById("ELEVACION").value;

  azimut = azimut < 0 || azimut > 360 ? 0 : azimut;
  elevacion = elevacion < 0 || elevacion > 90 ? 90 : elevacion;

  return [azimut, elevacion];
}

// ->->->->->->->
// SERIAL WEB API
// ->->->->->->->

async function conectarTelescopio() {
  port = await navigator.serial.requestPort({});
  await port.open({ baudRate: 115200 });

  //document.querySelector("input").disabled = false;
  TELESCOPIO.innerText = "🔌 Desconectar Telescopio";

  const encoder = new TextEncoderStream();
  outputDone = encoder.readable.pipeTo(port.writable);
  outputStream = encoder.writable;
}

async function enviarComandoTelescopio() {
  try {
    if (port) {
      let comando = "AZp ";
      comando += PANEL.objeto.azimut;
      comando += " 5000 \r\n";

      const writer = outputStream.getWriter();
      console.log("[SEND]", comando);
      writer.write(comando);
      writer.releaseLock();
    } else {
      console.log("ERROR PORT");
    }
  } catch (error) {
    console.log(error);
  }
}

// EVENT LISTENERS

//const OBJETO_INFO = document.querySelector("#OBJETO_INFO");

const TELESCOPIO = document.getElementById("TELESCOPIO");
let port;
TELESCOPIO.addEventListener("click", function () {
  if (port) {
    port.close();
    port = undefined;
    TELESCOPIO.innerText = "🔌 Conectar con el Telescopio";
  } else {
    conectarTelescopio();
  }
});

const NOCHE = document.querySelector("#NOCHE");
NOCHE.addEventListener("click", panel_modo_noche);

const STELLARIUM = document.querySelector("#STELLARIUM");
STELLARIUM.addEventListener("click", boton_STELLARIUM);
//STELLARIUM.addEventListener("click", stellarium_main_status);
//STELLARIUM.addEventListener("click", panel_imprime_lista_tipos_objetos_celestes);
//STELLARIUM.addEventListener("click", panel_imprime_lista_objetos_celestes);

const LISTA_OBJETOS = document.querySelector("#LISTA_OBJETOS");
//LISTA_OBJETOS.addEventListener("change", panel_imprime_objeto);
LISTA_OBJETOS.addEventListener("change", stellarium_object_info);
LISTA_OBJETOS.addEventListener("change", panel_imprime_objeto_seleccionado);

async function boton_STELLARIUM() {
  //stellarium_main_status().then(() => panel_imprime_lista_tipos_objetos_celestes);
  await stellarium_main_status();
  panel_imprime_locacion();
  await panel_imprime_lista_tipos_objetos_celestes();
  await panel_imprime_lista_objetos_celestes();
  return "CACA";
}

/*
const LISTA_TIPO_OBJETOS = document.querySelector("#LISTA_TIPO_OBJETOS");
LISTA_TIPO_OBJETOS.addEventListener("change", setTipoObjetoPanel);
LISTA_TIPO_OBJETOS.addEventListener("change", listaObjetosCelestes);

const SEGUIMIENTO = document.querySelector("#SEGUIMIENTO");
SEGUIMIENTO.addEventListener("click", () => {
  PANEL.serial.seguimiento = PANEL.serial.seguimiento == 0 ? setInterval(datosObjeto, 200) : PANEL.serial.seguimiento;
  PANEL.serial.intervalo = PANEL.serial.intervalo == 0 ? setInterval(enviarComandoTelescopio, 200) : PANEL.serial.intervalo;
});

const STOP = document.querySelector("#STOP");
STOP.addEventListener("click", () => {
  clearInterval(PANEL.serial.seguimiento);
  PANEL.serial.seguimiento = 0;
  clearInterval(PANEL.serial.intervalo);
  PANEL.serial.intervalo = 0;
  console.log("STOP");
});

const ANGULO = document.querySelector("#ANGULO");
ANGULO.addEventListener("click", angulo);
*/

// corre panel_stellarium_online hasta que conecta
//const intervalo_stellarium_online = setInterva(panel_stellarium_online, 200);
