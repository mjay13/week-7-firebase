// Initialize Firebase
var config = {
    apiKey: "AIzaSyCiuEG8-3Zd_q2J0HAmOFoUyd3qe9_wcQw",
    authDomain: "train-time-a753e.firebaseapp.com",
    databaseURL: "https://train-time-a753e.firebaseio.com",
    projectId: "train-time-a753e",
    storageBucket: "train-time-a753e.appspot.com",
    messagingSenderId: "197917481665"
  };

  firebase.initializeApp(config);



// firebase variable
var database = firebase.database();

// on click for submitting the form to firebase
$("#submit").on("click", function() {
    event.preventDefault();

    // set variables to the submitted information
    var inputTrainName = $("#inputTrainName").val().trim();
    var inputDestination = $("#inputDestination").val().trim();
    var inputFirstArrival = moment($("#inputFirstArrival").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var inputFrequency = $("#inputFrequency").val().trim();

    // variable to creating a new object with the individual train information stored inside
    var trainObject = {
        name: inputTrainName,
        destination: inputDestination,
        firstArrival: inputFirstArrival,
        frequency: inputFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // push "object" to database child "trains"
    database.ref().push(trainObject);

    // add a modal instead of an alert?
    alert("train added!");

    // clear form
    $("#inputTrainName").val("");
    $("#inputDestination").val("");
    $("#inputFirstArrival").val("");
    $("#inputFrequency").val("");

    return false;

    // // log train info -- not logging!?
    // console.log(trainObject.name);
    // console.log(trainObject.destination);
    // console.log(trainObject.firstArrival);
    // console.log(trainObject.frequency);

    // end of form submission    
});

// diplay/add to html
database.ref().on("child_added", function(snapshot) {
        // current time
        currentTime = moment().format("HH:mm");

        // create new variables to deal with the new information coming from the database. 
        var nameData = snapshot.val().name;
        var destinationData = snapshot.val().destination;
        var firstArrivalData = snapshot.val().firstArrival;
        var frequencyData = snapshot.val().frequency;

        // difference from the first arrival to current time
        var totalDiff = moment().diff(moment.unix(firstArrivalData), "minutes");

        // modulous from the total difference in minutes and the frequency at which the train runs
        var minuteMod = totalDiff % frequencyData;

        // the next train in minutes is the frequency of minutes that the train runs minus the modulous
        var minutesAway = frequencyData - minuteMod;

        // in military time showing when the next train arrives
        var nextArrival = moment().add(minutesAway, "m").format("HH:mm");


        // adds to html
        $("#trainInfo").append("<tr><td>" + nameData + "</td>" +
            "<td>" + destinationData + "</td>" +
            "<td>" + frequencyData + "</td>" +
            "<td>" + nextArrival + "</td>" +
            "<td>" + minutesAway + "</td></tr>");

        // show train object data
        console.log(snapshot.val());

        // log information
        console.log("Time: " + currentTime);
        console.log("Start Time: " + firstArrivalData);
        console.log("Total Time Difference: " + totalDiff);
        console.log("Modulous: " + minuteMod);
        console.log("Minutes Until Next Train: " + minutesAway);
        console.log("Next Train Arrives: " + nextArrival);
    },

    function(errorObject) {
        console.log("The read failed: " + errorObject.code);

        // end of database referencing
    });