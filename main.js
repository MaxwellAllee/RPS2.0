// Initialize Firebase
var config = {
    apiKey: "AIzaSyBcST_OgbzrGCdLvI9OjnhYfiajoag5-Pw",
    authDomain: "rps2-38744.firebaseapp.com",
    databaseURL: "https://rps2-38744.firebaseio.com",
    projectId: "rps2-38744",
    storageBucket: "rps2-38744.appspot.com",
    messagingSenderId: "572869490263"
};
firebase.initializeApp(config);
var outcom
var playerNam
var activityChck
var player
var otherPlayer
var nextStep = false
var swith = false
var run = false
var imgs = { //how the main images are stored
    waiting: "assets/images/waiting.gif",
    play: "assets/images/rockpaperscissorslizardspock_newthumb.png",
    clear: "assets/images/Clear.png"

}
var checkIt = "reset"//part of the way to prevent refreshing to soon
var noRepeat = false //part of the way to prevent refreshing to soon
var disconnect = {//this is what used to reset database data
    playerDos: { guess: "waiting", name: "blank", userId: 0 },
    playerUno: { guess: "waiting", name: "blank", userId: 0 },
    status: checkIt

}
var tables//where the table info is stored
var outcome = {//object where outcomes are checked
    rockpaper: "lose", rockscissor: "win", rocklizard: "win", rockspock: "lose", rockrock: "tie",
    paperrock: "win", paperscissor: "lose", paperlizard: "lose", paperspock: "win", paperpaper: "tie",
    scissorrock: "lose", scissorpaper: "win", scissorlizard: "win", scissorspock: "lose", scissorscissor: "tie",
    lizardrock: "lose", lizardpaper: "win", lizardscissor: "lose", lizardspock: "win", lizardlizard: "tie",
    spockrock: "win", spockpaper: "lose", spockscissor: "win", spocklizard: "lose", spockspock: "tie"
}
const userId = Math.floor(100000 + Math.random() * 90000)//unique identifier for each user
var database = firebase.database()//storing database
var ref
database.ref().on("value", function (snapshot) {
    var playd = snapshot.val().playerDos.userId//stores Dos player data
    var playo = snapshot.val().playerUno.userId//stores uno player data
    if (snapshot.val().safety === "reset" && noRepeat && snapshot.val().status === "reset") { // checks to see if opponent has disconnected
        outcom = "reset"
        database.ref().update({
            status: "normal"
        })
        localStorage.setItem("passingThis", outcom);
            location.href = 'exit.html'
    }
    if (playo != 0 && playd != 0 && swith) {//shows the actual game image and sets it up so clicks are being listened for 
        swith = false
        nextStep = true

        $(".instruction").html("<h3>Click the hand that you want to Play</h3>")
        $("#pht").attr("src", imgs.play);
    }
    if (playo === 0 && player === 0 && run) {//sees if playerUno postions is available
        database.ref().update({//sets it up so game will be reset if user exits unexpectedly
            safety: "reset"
        })
        noRepeat = true
        player = "playerUno"
        otherPlayer = "playerDos"
        run = false
        swith = true
        ref = firebase.database().ref();
        ref.onDisconnect().update(disconnect);
        database.ref().child(player).update({
            userId,
            name: playerNam
        });

    }

    else if (playd === 0 && player === 0 && run) {//sees if playerDos position is available
        database.ref().update({//sets it up so game will be reset user exits unexpectedly
            safety: "reset"
        })
        noRepeat = true
        player = "playerDos"
        otherPlayer = "playerUno"
        run = false
        swith = true
        ref = firebase.database().ref();
        ref.onDisconnect().update(disconnect);
        database.ref().child(player).update({
            userId,
            name: playerNam
        });
    }
});
function start() {
    $(".instruction").html("<h3>Waiting for opponent</h3>") // changes to waiting stage
    $("#pht").attr("src", imgs.waiting);

    $(".results").html("")
    player = 0
    run = true
    database.ref().update({
        status: userId
    })
}
$("#playerN").on("click", function (event) {
    event.preventDefault();
    playerNam = $("#player").val().trim();

    if (playerNam === "") {
        playerNam = "Anonymous"
    }
    start()
})

$(".guess").on("click", function () {
    if (nextStep) {
        checkIt = "normal"
        var userChoice = $(this).attr("data-gues")
        database.ref().child(player).update({
            guess: userChoice
        });
        database.ref().child(otherPlayer).on("value", function (snapshot) {
            database.ref().update({
                safety: "check"
            })
            if (snapshot.val().guess !== "waiting") {
                noRepeat = false
                var opponent = snapshot.val().guess
                var success = userChoice + opponent
                outcom = outcome[success]
                if (player === "playerUno") {
                    var otherName = snapshot.val().name
                    if (outcom === "win") {
                        tables = "<tr><td>" + playerNam + "</td><td>" + otherName + "</td></tr>"
                    }
                    else if (outcom === "lose") {
                        tables = "<tr><td>" + otherName + "</td><td>" + playerNam + "</td></tr>"
                    }
                    else if (outcom === "tie") {
                        tables = "<tr><td>" + otherName + " & " + playerNam + "</td><td></td></tr>"
                    }
                    database.ref().child("table").push({
                        rowz: tables
                    })
                }
                 // this is section is divided since I am using the same location to store and playing game on one computer
                
                if (outcom === "win"){
                localStorage.setItem("passingThis", outcom);
               
                    location.href = 'exit.html'}
                else {
                    setTimeout(myFunction, 3000)
                    function myFunction() {
                        localStorage.setItem("passingThis", outcom);
               
                        location.href = 'exit.html'
                    }
                }
            }
        })
    }
})

//Start Chat stuff
$("#button-addon2").on("click", function (event) {
    event.preventDefault();
    var getName
    var holder = $("#chatTxt").val().trim();

    $('.input-group').children('input').val('')
    if (player === "playerUno") {
        getName = '<font color= "red">' + playerNam + ': </font>'
    }
    else if (player === "playerDos") {
        getName = '<font color= "blue">' + playerNam + ': </font>'
    }
    else {
        getName = '<font color= "green">Anonymous: </font>'
    }
    holder = getName + holder + "<br>"
    database.ref().child("chat").push({
        chatIn: holder
    })

})

database.ref().child("chat").on("child_added", function (snapshot) {
    var snapIt = snapshot.val()
    $("#textHer").append(snapIt.chatIn)
})
//table write to Dom
database.ref().child("table").on("child_added", function (snapshot) {
    var snapThis = snapshot.val()
    $("#tableStuff").append(snapThis.rowz)
})



