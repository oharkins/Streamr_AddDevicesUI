const btnSendLocation = document.getElementById("btn-send-info");
btnSendLocation.hidden = true;
const dataLocation = document.getElementById("objToSend");
const qrreader = document.getElementById("qr-reader");

var recordObj = {};

const html5QrCode = new Html5Qrcode("qr-reader", {
  formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
});
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  console.log(`Scan result: ${decodedText}`, decodedResult);
  recordObj.DEUI = decodedText;
  html5QrCode
    .stop()
    .then((ignore) => {
      qrreader.hidden = true; // QR Code scanning is stopped.
      getLocation();
    })
    .catch((err) => {
      // Stop failed, handle it.
    });
};
const config = { fps: 20, qrbox: 250 };

html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

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
  PopulateData();
}
function PopulateData() {
  dataLocation.innerHTML =
    "DEUI:" +
    recordObj.DEUI +
    "<br/>GPS Latitude: " +
    recordObj.Location.latitude +
    " Longitude: " +
    recordObj.Location.longitude;
  btnSendLocation.hidden = false;
}

btnSendLocation.onclick = function () {
  qrreader.hidden = false;
  html5QrCode.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback
  );
  recordObj = {};
  dataLocation.innerHTML = "";
};
