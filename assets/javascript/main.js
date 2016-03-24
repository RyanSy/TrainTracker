//Display current date and time
var datetime = null,
        date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd | MMMM Do, YYYY | h:mm:ss A'));
};

$(document).ready(function(){
    datetime = $('#timeNow')
    update();
    setInterval(update, 1000);
});

// Create database in Firebase
var trainData = new Firebase("https://ryanbsy.firebaseio.com/");

$("#addTrainScheduleButton").on("click", function(){

// Grabs user input
var trainName = $("#trainNameInput").val().trim();
var destination = $("#destinationInput").val().trim();
var firstTrainTime = moment($("#firstTrainTimeInput").val().trim(), "HH:mm").format("HH:mm");
var frequency = $("#frequencyInput").val().trim();

// Creates local "temporary" object for holding train schedule data
var newTrainScheduleData = {
    name: trainName,
    destination: destination,
    time: firstTrainTime,
    frequency: frequency
}

// Uploads train schedule data to the database
trainData.push(newTrainScheduleData);

// Logs everything to console
console.log(newTrainScheduleData.name);
console.log(newTrainScheduleData.destination); 
console.log(newTrainScheduleData.time);
console.log(newTrainScheduleData.frequency)

// Alert
alert("Train schedule successfully added!");

// Clears all of the text-boxes
$("#trainNameInput").val("");
$("#destinationInput").val("");
$("#firstTrainTimeInput").val("");
$("#frequencyInput").val("");

// Prevents moving to new page
return false;
});


// Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
trainData.on("child_added", function(childSnapshot, prevChildKey){

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // Assumptions
    var tFrequency = frequency; 
    var firstTime = firstTrainTime; // Time is 3:30 AM
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime,"hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency; 
    console.log(tRemainder);
    // Minutes Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes")
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"))

    // Add each train's data into the table 
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " Minutes" + "</td><td>" + nextTrain.format("hh:mm A") + "</td><td>" + tMinutesTillTrain + " Minutes" + "</td></tr>");

});