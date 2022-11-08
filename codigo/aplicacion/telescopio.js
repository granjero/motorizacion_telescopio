const button = document.querySelector("button");

button.addEventListener("click", async function () {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort();
    // Wait for the serial port to open.
    await port.open({ baudRate: 115200 });
});

let url = "http://127.0.0.1:8090/api/objects/listobjecttypes";

fetch(url, {
    method: "GET",
    mode: "no-cors",
    cache: "no-cache",
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((res) => console.log(res))
    .then((out) => console.log(out))
    .catch((err) => {
        throw err;
    });

console.log("caca");
