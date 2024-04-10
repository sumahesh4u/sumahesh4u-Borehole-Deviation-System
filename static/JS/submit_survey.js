var socket = io.connect(`http://${document.domain}:${location.port}`);
var getTime = null;
var timerLable = document.getElementById("timerLabel");

// Enable battery level button and disable others initially
document.getElementById("batteryLevelRequest").disabled = false;
document.getElementById("calibrateButton").disabled = false;
document.getElementById("startButton").disabled = false;
document.getElementById("markStationID").disabled = true;
document.getElementById("endButton").disabled = true;
document.getElementById("manualBtn").disabled = false;
document.getElementById("dataBtn").disabled = false;

//calibrate button send start calibration to py
document
  .getElementById("calibrateButton")
  .addEventListener("click", function (event) {
    //send command to start calibration
    console.log("calibration button clicked");
    socket.emit("startCalibration");
    document.getElementById("calibrateButton").disabled = true;
    document.getElementById("Stopcalibrate").disabled = false;
    document.getElementById("markStationID").disabled = true;
    document.getElementById("endButton").disabled = true;
    document.getElementById("batteryLevelRequest").disabled = true;
    document.getElementById("startButton").disabled = true;
  });

socket.on("calibrationOk", function (data) {
  console.log(data);
  let stage1 = document.getElementById("stage1");
  let stage2 = document.getElementById("stage2");
  let stage3 = document.getElementById("stage3");
  let stage4 = document.getElementById("stage4");

  let okStatus = "#23d823d2";
  let notOkStatus = "#9c2222c4";
  let okStatus1 = "#ec4300dc";
  let okStatus2 = "#fbff00c2";
  //handles all the greens
  if (data.stage1 === "3") {
    stage1.style.backgroundColor = okStatus;
  } else if (data.stage1 === "2") {
    stage1.style.backgroundColor = okStatus2;
  } else if (data.stage1 === "1") {
    stage1.style.backgroundColor = okStatus1;
  } else {
    stage1.style.backgroundColor = notOkStatus;
  }

  if (data.stage2 === "3") {
    stage2.style.backgroundColor = okStatus;
  } else if (data.stage2 === "2") {
    stage2.style.backgroundColor = okStatus2;
  } else if (data.stage2 === "1") {
    stage2.style.backgroundColor = okStatus1;
  } else {
    stage2.style.backgroundColor = notOkStatus;
  }

  if (data.stage3 === "3") {
    stage3.style.backgroundColor = okStatus;
  } else if (data.stage3 === "2") {
    stage3.style.backgroundColor = okStatus2;
  } else if (data.stage3 === "1") {
    stage3.style.backgroundColor = okStatus1;
  } else {
    stage3.style.backgroundColor = notOkStatus;
  }

  if (data.stage4 === "3") {
    stage4.style.backgroundColor = okStatus;
  } else if (data.stage4 === "2") {
    stage4.style.backgroundColor = okStatus2;
  } else if (data.stage4 === "1") {
    stage4.style.backgroundColor = okStatus1;
  } else {
    stage4.style.backgroundColor = notOkStatus;
  }
  if (stage1 != "3" && stage2 != "3" && stage3 != "3" && stage4 != "3") {
    socket.emit("getCalibration");
  }
});

document
  .getElementById("Stopcalibrate")
  .addEventListener("click", function (event) {
    console.log("stop calibration button clicked");
    socket.emit("stopCalibration"); // Emitting the stopCalibration event to the server
    document.getElementById("Stopcalibrate").disabled = true;
    document.getElementById("calibrateButton").disabled = false;
    document.getElementById("startButton").disabled = false;
    document.getElementById("batteryLevelRequest").disabled = false;
  });

// Add event listener for the 'calibrationInterrupted' event
socket.on("calibrationInterrupted", function () {
  // Handle the calibration interruption
  console.log("Calibration interrupted");
  document.getElementById("Stopcalibrate").disabled = true;
  // You can perform any additional actions here, such as displaying a message to the user
  alert("Calibration Completed.");
  document.getElementById("startButton").disabled = false;
});

const inital_interval = parseInt(
  document.getElementById("start_interval").innerHTML
);

const direction = document.getElementById("direction").innerText;

//start button event listener
document
  .getElementById("startButton")
  .addEventListener("click", function (event) {
    console.log("start button pressed");
    socket.emit("start_counter"); //send cmd to server to start
    document.getElementById("markStationID").disabled = false;
    document.getElementById("batteryLevelRequest").disabled = true;
    document.getElementById("calibrateButton").disabled = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("endButton").disabled = false;
    document.getElementById("manualBtn").disabled = true;
    document.getElementById("dataBtn").disabled = true;
  });

socket.on("update_counter", function (data) {
  timerLable.innerText = "Timer: " + data.value;
  getTime = data.value;
});

let isItInitialDepth = true; //to check if it is first time user clicking the mark station button
let depth = 0; //the variable which stores the current depth
const inital_depth = parseInt(document.getElementById("start_depth").value); //the starting value given by the user

function depthCalculation() {
  //function to calculate the depth
  if (direction == "in") {
    depth = depth + inital_interval;
    document.getElementById("start_depth").value = depth + inital_interval; //this shows what to display to user
  } else {
    depth = depth - inital_interval;
    document.getElementById("start_depth").value = depth - inital_interval;
  }
}

//when the mark station button is clicked
document
  .getElementById("markStationID")
  .addEventListener("click", function (event) {
    console.log("mark station is pressed");

    // If start depth has not been set initially, exit the function
    if (isItInitialDepth) {
      depth = inital_depth; //don't remove this line

      logData(inital_depth); //store the depth values in the table

      if (direction == "in") {
        document.getElementById("start_depth").value = depth + inital_interval; //this shows what to display to user
      } else {
        document.getElementById("start_depth").value = depth - inital_interval;
      }

      isItInitialDepth = false; // now update that user has pressed his mark station for first time
      disableMarkStationButtonForTenSeconds(); //calling the progress bar function
      return; // Exit the function
    }

    depthCalculation(); //calculate the depth
    logData(depth); //store the depth values in the table

    disableMarkStationButtonForTenSeconds(); //calling the progress bar function

    document.getElementById("endButton").disabled = false;
    document.getElementById("startButton").disabled = true;
  });

document
  .getElementById("endButton")
  .addEventListener("click", function (event) {
    console.log("End button pressed");
    if (window.confirm("Do you want to end the survey?")) {
      socket.emit("stopCounter");
      socket.emit("Return_to_page1");
      getTime = 0;
      exportTableToExcel();
      return_to_page1();
    }
  });

//request for battery level
document
  .getElementById("batteryLevelRequest")
  .addEventListener("click", function (event) {
    console.log("request for battery level sent");
    socket.emit("/batteryLevel"); //send request for battery level
  });

//to get the battery percentage from the python
socket.on("batteryLevelFromServer", function (data) {
  document.getElementById("batteryPercentage").innerText =
    "Battery Percentage: " + data.batteryLevel + "%";
  console.log(data);
  document.getElementById("batteryLevelRequest").disabled = false;
});

function getTimerValue() {
  var timerValue = fetch("/getTimerValue", { method: "GET" }); //some dummy function

  return timerValue;
}

function logData(stationValue) {
  const table = document.getElementById("the_table"); //get table
  var row = table.insertRow(); //create a row

  //inserting data into the columns
  row.insertCell(0).textContent = getTime;
  row.insertCell(1).textContent = stationValue;
}

function exportTableToExcel() {
  // Reference the table
  var table = document.getElementById("the_table");

  // Initialize an empty CSV content string
  var csvContent = "";

  // Loop through each row of the table
  var rows = table.rows;
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].cells;

    // Loop through each cell of the row
    for (var j = 0; j < cells.length; j++) {
      // Append cell content to the CSV string
      csvContent += cells[j].textContent.trim();

      // Add comma after each cell value (except for the last cell in the row)
      if (j < cells.length - 1) {
        csvContent += ",";
      }
    }

    // Add newline character after each row (except for the last row)
    if (i < rows.length - 1) {
      csvContent += "\n";
    }
  }

  // Create a Blob object from the CSV content
  var csvBlob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8",
  });

  // Create a FormData object to send the CSV data to Flask
  var formData = new FormData();
  formData.append("file", csvBlob, "computerSurvey.csv"); // Name the file

  // Send a POST request to Flask to save as Excel
  fetch("/save_computer_survey_excel", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}
// Function to disable the Mark Station button for 10 seconds
function disableMarkStationButtonForTenSeconds() {
  var markStationButton = document.getElementById("markStationID");
  var progressBar = document.getElementById("markStationProgress");

  markStationButton.disabled = true; // Disable the button

  // Reset progress bar
  progressBar.value = 100;
  progressBar.max = 100;

  var decrementValue = 100 / 30; // Decrement value for 30 seconds

  var timer = setInterval(function () {
    progressBar.value -= decrementValue; // Update progress bar

    if (progressBar.value <= 0) {
      clearInterval(timer); // Clear the interval after 30 seconds
      markStationButton.disabled = false; // Enable the button
      progressBar.value = 0; // Reset progress bar value
    }
  }, 1000); // Update the progress bar every second
}
function return_to_page1() {
  fetch("/return-to-page1")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Handle the response here if needed
      // For example, you can redirect to another page
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
