async function getReader() {
    port = await navigator.serial.requestPort({});
    await port.open({ baudRate: 9600 });

    connectButton.innerText = "🔌 Disconnect";

    ledDimmer.addEventListener("input", (event) => {
        if (port && port.writable) {
            const value = parseInt(event.target.value);
            const bytes = new Uint8Array([value]);
            const writer = port.writable.getWriter();

            writer.write(bytes);
            writer.releaseLock();
        }
    });
}

const connectButton = document.getElementById("connect-button");
let port;

if ("serial" in navigator) {
    connectButton.addEventListener("click", function () {
        if (port) {
            port.close();
            port = undefined;

            connectButton.innerText = "🔌 Connect";
            document
                .querySelector("figure")
                .classList.replace("bounceIn", "fadeOut");
        } else {
            getReader();
        }
    });

    connectButton.disabled = false;
} else {
}
