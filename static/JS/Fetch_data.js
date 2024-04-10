var socket = io.connect(`http://${document.domain}:${location.port}`);

// Check connection status
function checkConnection() {
  if (socket.connected) {
    console.log("Socket.IO connection is already established.");
  } else {
    console.log("Socket.IO connection is not established yet.");
  }
}

// Listen for connect event
socket.on("connect", () => {
  console.log("Socket.IO connection established.");
  checkConnection(); // Check connection status
});

//Read_button send 'read data' to py
document.getElementById("read").addEventListener("click", function (event) {
  event.preventDefault();
  //send command to start Reading data
  console.log("pressed the read button");
  console.log("sending request to the server");
  alert("Sending request to hardware.............");
  socket.emit("/Read_data");
  
});

socket.on("/readingStarted", function (data) {
  alert("Retriving data from hardware.");
});

//checking if data is sent by the server
socket.on("/data_received", function (data) {

  console.log("showiong server respnse: ",data);

  if (data.file_path != "none") {
    // When file path is given
    console.log("Excel file saved at: " + data.file_path);
    alert("Data Fetched Successfully");
} else {
    console.log("No file name given, might be due to direct access of fetch data page. So enter the file name to read manually");
    
    // Create a file input element to allow the user to select the folder path
    let input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('directory', '');
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('mozdirectory', '');

    input.onchange = function() {
      let folderPath = this.files[0].webkitRelativePath.split('/')[0]; // Extracting folder name
      let file2Read = prompt("Enter the Name of the file to read:");

        console.log("Folder path:", folderPath);
        console.log("File name:", file2Read);
        
        // Send the file name and folder path to the Flask server
        socket.emit("Readfile", { file_name: file2Read, folder_path: folderPath });
    };

    input.click(); // Trigger the file input click event
}
});
document.getElementById("clear").addEventListener("click", function (event) {
  //send command to start calibration
  socket.emit("clear_data");
});
socket.on("data_sent", function (response) {
  console.log(response.message);
  alert("SD Cleared");
});
document.getElementById("generate").addEventListener("click", function (event) {
  socket.emit("Generate_Report");
});
// document.getElementById("report").addEventListener("click", function (event) {
//   socket.emit("PDF_Report");
// });
