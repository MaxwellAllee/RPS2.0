
var outcom = localStorage.getItem("passingThis")
var exitHead = {
    lose: "You Lost!", win: "You Win!", tie: "You Tied!", reset: "Your opponent left the game!"
}
var exitPhoto = {
    lose: "assets/images/lose.gif", win: "assets/images/win.gif", tie: "assets/images/tie.gif", reset: "assets/images/left.gif"
}

console.log(exitPhoto[outcom])
$("#exitHeader").html(exitHead[outcom])
$("#exitPhoto").html('<div><img src="'+exitPhoto[outcom]+'"></div>')
$("#goHome").on("click", function () {
    console.log("trying to go home")
    location.href = "index.html";
})