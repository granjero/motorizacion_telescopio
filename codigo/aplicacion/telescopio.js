const button = document.querySelector("button");
const p = document.getElementById("connectionResult");

document.getElementById("connectionResult").innerText = "Hola";

console.log(p);

let port;

button.addEventListener("click", async function () {
  // Prompt user to select any serial port.
  port = await navigator.serial.requestPort();
  // Wait for the serial port to open.
  await port.open({ baudRate: 115200 });
  var buf = "";
  var str = "";
  while (port.readable) {
    const reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // |reader| has been canceled.
          console.log("Done ", done);
          break;
        }

        for (var i = 0; i < value.length; i++) {
          //console.log(i, String.fromCharCode(value[i]));

          str += String.fromCharCode(value[i]);
          if (String.fromCharCode(value[i]) === "\n") {
            console.log("END", str);
            str = "";
          }
        }
      }
    } catch (error) {
      console.log("error");
    } finally {
      reader.releaseLock();
    }
  }
});

///////////////////////////

// navigator.serial.addEventListener("connect", (e) => {
//   // Connect to `e.target` or add it to a list of available ports.
// });

// navigator.serial.addEventListener("disconnect", (e) => {
//   // Remove `e.target` from the list of available ports.
// });

// navigator.serial.getPorts().then((ports) => {
//   // Initialize the list of available ports with `ports` on page load.
// });

// button.addEventListener("click", () => {
//   navigator.serial
//     .requestPort()
//     .then((port) => {
//       // Connect to `port` or add it to the list of available ports.
//     })
//     .catch((e) => {
//       // The user didn't select a port.
//       console.log("no se selecciono");
//     });
// });

/////////////////////////

// let url = "http://127.0.0.1:8090/api/objects/listobjecttypes";

// fetch(url, {
//   method: "GET",
//   mode: "no-cors",
//   cache: "no-cache",
//   headers: {
//     "Content-Type": "application/json",
//   },
// })
//   .then((res) => console.log(res))
//   .then((out) => console.log(out))
//   .catch((err) => {
//     throw err;
//   });
