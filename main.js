

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
var imgs = {
    waiting: "assets/images/waiting.gif",
    play: "assets/images/rockpaperscissorslizardspock_newthumb.png",
    clear: "assets/images/Clear.png"

}
var checkIt = "reset"
var noRepeat = false
var disconnect = {
    playerDos: { guess: "waiting", name: "blank", userId: 0 },
    playerUno: { guess: "waiting", name: "blank", userId: 0 },
    status: checkIt

}
var tables
var outcome = {
    rockpaper: "lose", rockscissor: "win", rocklizard: "win", rockspock: "lose", rockrock: "tie",
    paperrock: "win", paperscissor: "lose", paperlizard: "lose", paperspock: "win", paperpaper: "tie",
    scissorrock: "lose", scissorpaper: "win", scissorlizard: "win", scissorspock: "lose", scissorscissor: "tie",
    lizardrock: "lose", lizardpaper: "win", lizardscissor: "lose", lizardspock: "win", lizardlizard: "tie",
    spockrock: "win", spockpaper: "lose", spockscissor: "win", spocklizard: "lose", spockspock: "tie"
}

const userId = Math.floor(100000 + Math.random() * 90000)

var database = firebase.database()
var ref


console.log(playerNam)
database.ref().on("value", function (snapshot) {
    var playd = snapshot.val().playerDos.userId
    var playo = snapshot.val().playerUno.userId
    console.log("playd", playd)
    console.log("playo", playo)
    if (snapshot.val().safety === "reset" && noRepeat && snapshot.val().status === "reset") {
        outcom = "reset"
        database.ref().update({
            status: "normal"
        })
        localStorage.setItem("passingThis", outcom);
            location.href = 'exit.html'
    }
    if (playo != 0 && playd != 0 && swith) {
        swith = false
        nextStep = true

        $(".instruction").html("<h3>Click the hand that you want to Play</h3>")
        $("#pht").attr("src", imgs.play);

    }
    if (playo === 0 && player === 0 && run) {
        database.ref().update({
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

        console.log("you are player one")
    }

    else if (playd === 0 && player === 0 && run) {
        database.ref().update({
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

        console.log("you are player two")
    }

});

function start() {


    $(".instruction").html("<h3>Waiting for opponent</h3>")
    $("#pht").attr("src", imgs.waiting);

    $(".results").html("")
    player = 0
    run = true
    console.log("run " + run)
    console.log("player " + player)
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

$("#reset").on("click", function () {

    reset()
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

            console.log(checkIt)
            console.log(noRepeat)


            if (snapshot.val().guess !== "waiting") {
                noRepeat = false
                var opponent = snapshot.val().guess
                var success = userChoice + opponent

                console.log(success)
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
                    console.log(tables)
                    database.ref().child("table").push({
                        rowz: tables
                    })
                }
                 // this is section is divided since I am using the same location to store and playing game on one computer
                localStorage.setItem("passingThis", outcom);
               
                if (outcom === "win")
                    location.href = 'exit.html'
                else {
                    setTimeout(myFunction, 2000)
                    function myFunction() {
                        location.href = 'exit.html'
                    }
                }
            }
        })
    }
})
function reset() {
    console.log("here")
    database.ref().update(disconnect);
}
/*function hardReset() {


    if (player === "playerUno") {
        console.log("why")
        database.ref().update(disconnect);
        $(".results").html("")
        player = 0
      
        $(".instruction").html("<h3>Waiting for opponent</h3>")
        $("#pht").attr("src", imgs.waiting);
        start()
    }
    else {
        $(".results").html("")
        player = 0
        $(".instruction").html("<h3>Waiting for opponent</h3>")
        $("#pht").attr("src", imgs.waiting);
        
        start()
    }


    if (player === "playerUno") {
        console.log("why")
        database.ref().update(disconnect);
        $(".results").html("")
        player = 0
      
        $(".instruction").html("<h3>Waiting for opponent</h3>")
        $("#pht").attr("src", imgs.waiting);
        start()
    }
    else {
        $(".results").html("")
        player = 0
        $(".instruction").html("<h3>Waiting for opponent</h3>")
        $("#pht").attr("src", imgs.waiting);
        
        start()
    }
}*/
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
    console.log(holder)
    database.ref().child("chat").push({
        chatIn: holder
    })

})

database.ref().child("chat").on("child_added", function (snapshot) {
    var snapIt = snapshot.val()
    console.log(snapIt.chatIn)
    $("#textHer").append(snapIt.chatIn)
})
//table write to Dom
database.ref().child("table").on("child_added", function (snapshot) {
    var snapThis = snapshot.val()
    console.log(snapThis.rowz)
    $("#tableStuff").append(snapThis.rowz)
})



