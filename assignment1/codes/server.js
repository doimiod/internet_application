const express = require('express')
const app = express()
const port = 3000

const axios = require("axios")

const path = require("path")

// let publicPath= path.resolve(__dirname,"public") 
// app.use(express.static(publicPath))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/client.html'));
  });

app.get('/weatherForecast/:city', sendWeatherInfo)

app.listen(port, () => console.log(`weather forecast app listening on port ${port}!`))


function sendWeatherInfo(req, res) {

    let city = req.params.city // input from user
    var key = "fdd7644f33ac6e3c158e6ea9f1b9c526" // key

    // i used units=metric to get celcius
    axios("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid="+key)
    .then(Response => { // get weather forecst api

        cityWeatherData = Response.data

        console.log(cityWeatherData)

        var cityName = cityWeatherData.city.name // get the name of the city
        var lat = cityWeatherData.city.coord.lat // get lat
        var lon = cityWeatherData.city.coord.lon // get lon

        console.log(cityName)
        console.log(lat)
        console.log(lon)
        console.log(cityWeatherData.list.length)


        // const date = new Date(unixTimestamp * 1000);
        // const hours = date.getHours();
        // const minutes = date.getMinutes();
        // const seconds = date.getSeconds();

        dateArr = getDate(cityWeatherData)
        tempAvgArr = dataCalc(cityWeatherData)
        tempStatArr = dataCalc(cityWeatherData)
        highestTempArr = dataCalc(cityWeatherData)
        lowestTempArr = dataCalc(cityWeatherData)
        winSpArr = dataCalc(cityWeatherData)
        yesOrNoArr = dataCalc(cityWeatherData)
        rainfallLevelArr = dataCalc(cityWeatherData)
    
        console.log(dateArr[0], dateArr[1])


        // check if there is much pm2.5
        axios("http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="+lat+"&lon="+lon+"&appid="+key)
        .then(Response => {

        contarminated = false
        cityPollutionData = Response.data

        for(let i = 0; i<cityPollutionData.list.length; i++){
            var amountOfPM2_5 = cityPollutionData.list[i].components.pm2_5
            console.log(amountOfPM2_5)
            if(amountOfPM2_5 > 10){
                contarminated = true
                break
            }
        }
        
        res.json({
            date: dateArr,
            cityName: cityName,
            tempAvg: tempAvgArr,
            tempStat: tempStatArr,
            highestTemp: highestTempArr,
            lowestTemp: lowestTempArr,
            winSpAvg:  winSpArr,
            yesOrNo: yesOrNoArr,
            rainfallLevel: rainfallLevelArr,
            needMask: contarminated
            });
        })

    })    
    
}

//get the date here
function getDate(cityWeatherData){

    dateArr = []
    k = 0
    for(let i = 0; i< cityWeatherData.list.length; i++){

        let date = cityWeatherData.list[i].dt_txt.slice(11, 19)
        console.log(date)
        if(date == "00:00:00" && i!=0){
            dateArr[k] = cityWeatherData.list[i].dt_txt.slice(0, 10)
            k++
            if(k == 4) break
            
        }
    }
    return dateArr
}


// all calculations are done here
function dataCalc(cityWeatherData){

    tempAvgArr = []
    tempSum = 0
    tempAvg = 0
    tempStatArr = []
    highestTempArr = []
    highestTemp = -100000
    lowestTempArr = []
    lowestTemp = 100000

    winSpArr = []
    sumWinSp = 0

    willBeRainy = false
    yesOrNoArr = []

    rainfallLevelArr = []
    sumRainfallLevel = 0

    startcalc = false


    j = 0
    k = 0

    for(let i = 0; i< cityWeatherData.list.length; i++){

        let time = cityWeatherData.list[i].dt_txt.slice(11, 19)
        // console.log(time)
        if(time == "00:00:00" && startcalc == false){
            startcalc = true
        }

        if(startcalc == true){
            tempSum = tempSum + cityWeatherData.list[i].main.temp

            if(highestTemp<cityWeatherData.list[i].main.temp_max)
            highestTemp = cityWeatherData.list[i].main.temp_max
            if (lowestTemp>cityWeatherData.list[i].main.temp_min)
            lowestTemp = cityWeatherData.list[i].main.temp_min

            sumWinSp = sumWinSp + cityWeatherData.list[i].wind.speed

            if(cityWeatherData.list[i].weather[0].main.includes("Rain"))
            willBeRainy = true

            // if(cityWeatherData.list[i].rain['3h']!=null)
            // sumRainfallLevel = sumRainfallLevel + cityWeatherData.list[i].rain['3h']
            
            j++
        }

        if(time == "21:00:00" && startcalc == true){
            tempAvg = (tempSum/j).toFixed(1)                //for temparature
            
            highestTemp = (highestTemp).toFixed(1)
            lowestTemp = (lowestTemp).toFixed(1)

            tempAvgArr[k] = tempAvg
            highestTempArr[k] = highestTemp
            lowestTempArr[k] = lowestTemp

            if(tempAvg<12)
            tempStatArr[k] = "cold"
            else if(tempAvg>24)
            tempStatArr[k] = "cold"
            else 
            tempStatArr[k] = "mild"

            winSpAvg = (sumWinSp/j).toFixed(2)   //for wind speed
            winSpArr[k] = winSpAvg

            if(willBeRainy)                      // for rainy forecast
            yesOrNoArr[k] = "yes"
            else
            yesOrNoArr[k] = "no"

            sumRainfallLevel = (sumRainfallLevel/j).toFixed(2)
            rainfallLevelArr[k] = sumRainfallLevel

            k++
            if(k == 4) return tempAvgArr, tempStatArr, highestTempArr, lowestTempArr, winSpArr, yesOrNoArr, rainfallLevelArr
            tempSum = 0
            tempAvg = 0
            highestTemp = -100000
            lowestTemp = 100000
            sumWinSp = 0
            willBeRainy = false
            sumRainfallLevel = 0
            j = 0
        }


    }

}
