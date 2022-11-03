
console.log('test');

async function inicializaPuerto() {
	let promesa = new Promise();
	const port = await navigator.serial.requestPort();
	return port;
}

function puertoSeleccionado()
{
return new Promise
}

inicializaPuerto();


while (port.readable) {
  const reader = port.readable.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // |reader| has been canceled.
        break;
      }
      console.log(value);
      // Do something with |value|…
    }
  } catch (error) {
    // Handle |error|…
  } finally {
    reader.releaseLock();
  }
}

