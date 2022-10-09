var timeLeft = 25;
function timer(timeLeft) {
    return new Promise((resolve, reject) => {
        interval = setInterval(function () {
            
            console.log(timeLeft)
            document.getElementById("time").innerHTML = "part 1: " + timeLeft
            if (timeLeft % 5 == 0) {
                console.log(timeLeft)
                document.getElementById("time with 5 seconds").innerHTML = "part 2: " + timeLeft
            }
            timeLeft = timeLeft - 1
            if (timeLeft < 0) {
                console.log("time is up")

                // document.getElementById("time is up").innerHTML = "<b>Time is up</b>"
                clearInterval(interval);
                resolve();
                // window.confirm("Do/ you want to go again")
            }

        }, 1000)
    });

}

timer(timeLeft).then(() => {
    if (confirm("Do you want to go again")) {
        timer(timeLeft)
        console.log("it is confirmed")
    } else
        console.log("it is canceled")
})

// async function main(){
//     const prom = await timer(10);
//     console.log(prom);
// }

// main();