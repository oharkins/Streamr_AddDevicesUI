const btnGetLocation = document.getElementById("btn-get-location");
const dataLocation = document.getElementById("objToSend");
const qrreader = document.getElementById("qr-reader");

var recordObj = {};

const html5QrCode = new Html5Qrcode("qr-reader", {
  formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
});
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  console.log(`Scan result: ${decodedText}`, decodedResult);
  recordObj.DEUI = decodedText;
};
const config = { fps: 20, qrbox: 250 };

// If you want to prefer front camera
html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

btnGetLocation.onclick = () => {
  getLocation();
};
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  console.log(position.coords);
  recordObj.Location = position.coords;
  dataLocation.innerHTML =
    "DEUI:" +
    recordObj.DEUI +
    "<br/>GPS Latitude: " +
    recordObj.Location.latitude +
    " Longitude: " +
    recordObj.Location.longitude;
}
