

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
var playerNam
var activityChck
var player
var otherPlayer
var swith = true
var run = false
var imgs = {
    waiting: "assets/images/waiting.gif",
    play: "assets/images/rockpaperscissorslizardspock_newthumb.png",
    clear: "assets/images/Clear.png"

}
var disconect = {
    playerDos: { guess: "waiting", name: "blank", userId: 0 }, playerUno: { guess: "waiting", name: "blank", userId: 0 }, status: "reset"

}
var outcome = {
    rockpaper: "lose", rockscissor: "win", rocklizard: "win", rockspock: "lose", rockrock: "tie",
    paperrock: "win", paperscissor: "lose", paperlizard: "lose", paperspock: "win", paperpaper: "tie",
    scissorrock: "lose", scissorpaper: "win", scissorlizard: "win", scissorspock: "lose", scissorscissor: "tie",
    lizardrock: "lose", lizardpaper: "win", lizardscissor: "lose", lizardspock: "win", lizardlizard: "tie",
    spockrock: "win", spockpaper: "lose", spockscissor: "win", spocklizard: "lose", spockspock: "tie"
}

const userId = Math.floor(100000 + Math.random() * 90000)
console.log(userId)
var database = firebase.database()
var ref
console.log(database)
function game() {
    console.log(playerNam)
    database.ref().on("value", function (snapshot) {
        var playd = snapshot.val().playerDos.userId
        var playo = snapshot.val().playerUno.userId
        if (snapshot.val().status === "reset") {
            $(".results").html("<h2> Your opponent opponent has disconnected !<br> You will be returned to lobby in 5 seconds</h2>")
            setTimeout(start, 5000)
        }
        if (playo != 0 && playd != 0 && run && swith) {
            swith = false

            $(".instruction").html("<h3>Click the hand that you want to Play</h3>")
            $("#pht").attr("src", imgs.play);

        }
        if (playo === 0 && player === 0) {
            player = "playerUno"
            otherPlayer = "playerDos"
            run = true
            ref = firebase.database().ref();
            ref.onDisconnect().update(disconect);
            database.ref().child(player).update({
                userId
            });

            console.log("you are player one")
        }

        else if (playd === 0 && player === 0) {
            player = "playerDos"
            otherPlayer = "playerUno"
            run = true
            ref = firebase.database().ref();
            ref.onDisconnect().update(disconect);
            database.ref().child(player).update({
                userId
            });

            console.log("you are player two")
        }

    });
}
function start() {


    $(".instruction").html("<h3>Waiting for opponent</h3>")
    $("#pht").attr("src", imgs.waiting);
    database.ref().update({
        status: "normal"
    })
    $(".results").html("")
    player = 0
    game()
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

$(".guess").on("click", function (event) {
    if (player !== 0) {
        var userChoice = $(this).attr("data-gues")
        database.ref().child(player).update({
            guess: userChoice
        });
        database.ref().child(otherPlayer).on("value", function (snapshot) {

            if (snapshot.val().guess !== "waiting") {
                var opponent = snapshot.val().guess
                var success = userChoice + opponent
                console.log(success)
                var outcom = outcome[success]
                $(".results").html("<h2> Your opponent choose " + opponent + " You " + outcom + "!<br> You will be returned to lobby in 5 seconds</h2>")
                setTimeout(hardReset, 5000)
            }

        })
    }
})
function reset() {
    console.log("here")
    database.ref().child("playerDos").update({
        guess: "waiting",
        userId: 0,
    });
    database.ref().child("playerUno").update({
        guess: "waiting",
        userId: 0
    });
    player = 0
}
function hardReset() {


    if (player === "playerUno") {
        console.log("why")
        database.ref().child("playerDos").update({
            guess: "waiting",
            userId: 0,

        });
        database.ref().child("playerUno").update({
            guess: "waiting",
            userId: 0

        });
        $(".results").html("")
        player = 0
        swith = true
        $(".instruction").html("<h3>Waiting for opponent</h3>")
        $("#pht").attr("src", imgs.waiting);
        game()
    }
    else {
        $(".results").html("")
        player = 0
        swith = true
        $(".instruction").html("<h3>Waiting for opponent</h3>")
        $("#pht").attr("src", imgs.waiting);

        setTimeout(game, 1000)
    }
}