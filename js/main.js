// Selecting HTML elements
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const context = canvas.getContext("2d");

// Starting the camera
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    alert("Failed to access the camera. Please allow camera permissions.");
    console.error("Error accessing camera:", error);
  });

function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Encoding the image to a string
  const imageData = canvas.toDataURL("image/png");
  preview.src = imageData;
  preview.style.display = "block";
}

function saveScan() {
  const patientName = document.getElementById("patientName").value;
  if (!patientName || !preview.src.startsWith("data:image")) {
    alert("Please enter patient name and capture an image first.");
    return;
  }

  // Saving the encoded string to local storage
  localStorage.setItem("patientName", patientName);
  localStorage.setItem("paperScan", preview.src);
  alert("Scan saved successfully!");

  // Sending data to server
  const formData = new FormData();
  formData.append("patientName", patientName);
  formData.append("paperScan", preview.src);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
