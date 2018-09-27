
var outcom = localStorage.getItem("passingThis")
var exitHead = {
    lose: "You Lost!", win: "You Win!", tie: "You Tied!", reset: "Your opponent left the game!"
}
var exitPhoto = {
    lose: "assets/images/lose.gif", win: "assets/images/win.gif", tie: "assets/images/tie.gif", reset: "assets/images/left.gif"
}
$("#exitHeader").html(exitHead[outcom])
$("#exitPhoto").html('<div><img src="'+exitPhoto[outcom]+'"></div>')
$("#goHome").on("click", function () {
    location.href = "index.html";
})