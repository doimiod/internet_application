function getCityInfo(){

    var city = document.getElementById("user-input").value
    var key = "fdd7644f33ac6e3c158e6ea9f1b9c526"
    // fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+key) <- this is for current weather. we can ignore this.

    fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+key)
    .then(Response => Response.json())
    .then(data => {
        console.log(data)

        var cityName = data.city.name
        var lat = data.city.coord.lat
        var lon = data.city.coord.lon

        console.log(lat)
        console.log(lon)

        document.getElementById("city").innerHTML = cityName;

        for(let i = 0; i<4; i++){

            let k = i * 8
            willBeRainy = false
            var sumTemp = 0
            var highestTemp = -10000
            var lowestTemp = 10000
            var sumWinSp = 0
            var sumRainLev = 0

            for(let j = k; j < k + 8; j ++){
                
                // console.log(j+"   "+text)
                if(data.list[j].weather[0].main.includes("Rain"))
                willBeRainy = true

                temperature = data.list[j].main.temp
                sumTemp = sumTemp + temperature

                if(highestTemp<data.list[j].main.temp_max)
                highestTemp = data.list[j].main.temp_max
                else if (lowestTemp>data.list[j].main.temp_min)
                lowestTemp = data.list[j].main.temp_min

                // console.log(j+"   "+data.list[j].main.temp)

                windSpeed = data.list[j].wind.speed
                sumWinSp = sumWinSp + windSpeed

                // threeHours = '3h'
                // if(i==0){
                //     rainLev = data.list[j].rain["3h"]
                //     sumRainLev = sumRainLev + rainLev
                //     console.log(j+"   "+rainLev)
                // }
                


            }

            tempAvg = (sumTemp/8).toFixed(1)
            highestTemp = highestTemp.toFixed(1)
            lowestTemp = lowestTemp.toFixed(1)

            winSpAvg = (sumWinSp/8).toFixed(2)

            rainLevAvg = sumRainLev/8

            let date = data.list[k].dt_txt.slice(0, 10)
            document.getElementById("day"+i).innerHTML = `<h3>${date}</h3>`;

            if(tempAvg<12)
            document.getElementById("day"+i).innerHTML += `<p>It will be cold as the average tempareture is ${tempAvg}℃</p>`;
            else if(tempAvg>24)
            document.getElementById("day"+i).innerHTML += `<p>It will be hot as the average tempareture is ${tempAvg}℃</p>`;
            else 
            document.getElementById("day"+i).innerHTML += `<p>It will be mild as the average tempareture is ${tempAvg}℃</p>`;

            document.getElementById("day"+i).innerHTML += `<p>H: ${highestTemp}℃ L: ${lowestTemp}℃</p>`;

            document.getElementById("day"+i).innerHTML += `<p>Average wind speed of the day: ${winSpAvg}m/s</p>`;

            // if(i==0)
            // document.getElementById("day"+i).innerHTML += `<p>Rainfall Level: ${rainLevAvg}mm</p>`;


            if(willBeRainy == true)
            document.getElementById("day"+i).innerHTML += `<p>Do I need an umbrella?: yes</p>`;
            else
            document.getElementById("day"+i).innerHTML += `<p>Do I need an umbrella?: no</p>`;

        }

        getPollutionInfo(lat,lon, key)

    })
    
}



function getPollutionInfo(lat, lon, key){

    fetch("http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="+lat+"&lon="+lon+"&appid="+key)
        .then(Response => Response.json())
        .then(data => {
        console.log(data)

        document.getElementById("pollutionHeader").innerHTML = "Air pollution for 5 days";

        // let date = data.list[1].dt_txt.slice(0, 10);
        // console.log(date)


        // return date

        })

}