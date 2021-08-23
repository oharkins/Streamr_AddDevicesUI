$(document).ready(function () {
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

  html5QrCode.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback
  );

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    console.log(position.coords);
    recordObj.datetime = Date.now();
    recordObj.location = {};
    recordObj.location.latitude = position.coords.latitude;
    recordObj.location.longitude = position.coords.longitude;
    console.log("STRINGIFY: " + JSON.stringify(recordObj));
    PopulateData();
  }
  function PopulateData() {
    dataLocation.innerHTML =
      "DEUI:" +
      recordObj.DEUI +
      "<br/>GPS Latitude: " +
      recordObj.location.latitude +
      " Longitude: " +
      recordObj.location.longitude;
    btnSendLocation.hidden = false;
  }

  btnSendLocation.onclick = function () {
    var settings = {
      url: "https://kxryiauey7.execute-api.us-west-2.amazonaws.com/v1/storage",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(recordObj),
      error: function (xhr, status, error) {
        var errorMessage = xhr.status + ": " + xhr.statusText;
        alert("Error - " + errorMessage);
      }
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      recordObj = {};
      dataLocation.innerHTML = "";
    });

    qrreader.hidden = false;
    html5QrCode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback
    );
  };
});
