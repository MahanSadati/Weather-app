// add event listener to hamburger menu
document.querySelector(".hamburger").addEventListener("click", showMenu);
function showMenu() {
  document.querySelector(".menu").classList.toggle("show");
  document.querySelector(".hamburger").classList.toggle("rotate");
}

// add event listener to second part of menu for close menu
document.querySelector(".menu2").addEventListener("click", glasser);
function glasser() {
  document.querySelector(".menu").classList.toggle("show");
  document.querySelector(".hamburger").classList.toggle("rotate");
}
let datepage;
let NamePage;
let cities = []; //make city list using array
let city; //set global variable for city name

//add event listener to searchbox button
const search = document.querySelector(".search-button");
search.addEventListener("click", makeName);

//extract name from input value in check box
function makeName() {
  city = document.querySelector(".city-search-input").value;
  document.querySelector(".city-search-input").value = "";
  city = city.toLowerCase();
  const letter = city.charAt(0).toUpperCase();
  city = letter + city.substring(1);
  addcity();
}
//check city name in api an show success or error massage
function addcity() {
  let check = 0;
  if (cities.length >= 1) {
    for (i = 0; i < cities.length; i++) {
      if (cities[i] == city) check = 1;
    }
  }
  if (check == 0) {
    const data = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=730f050925d480d9f65e24f9ee55f977&units=metric`;
    fetch(data)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.main.temp);
        document.querySelector(".success").style.display = "block";
        makeCity(city);
        clearAll();
      })
      .catch(() => {
        document.querySelector(".error").style.display = "block"; //show invalid city name error
        document.querySelector(".success").style.display = "none";
        clearAll();
      });
  } else {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".error2").style.display = "block";
    document.querySelector(".success").style.display = "none";
    clearAll();
  }
}

// make new element and append new city in menu list
function makeCity(city) {
  let item = document.createElement("li");
  item.className = city;
  item.classList.toggle("cities");

  cities.push(city);
  const cityName = document.createElement("div");
  cityName.innerText = city;
  cityName.addEventListener("click", (event) =>
    showCityPage(event.target.innerText)
  ); //add event listener to city name to show city page
  const deleteItem = document.createElement("i");
  deleteItem.className = "delete fas fa-times";
  item.appendChild(cityName);
  item.appendChild(deleteItem);
  document.querySelector(".city-list").appendChild(item);
  setTimeout(()=>{
    addEvent();
  },500);
}
// add event listener to all delete icons
function addEvent(){
  document.querySelectorAll(".delete").forEach((item) => {
    item.firstChild.addEventListener("click", deleteCity);
  });
}
// //extract deleted city name from event.target
function deleteCity(event) {
  let classNamee = event.target.parentElement.parentElement.className.split(" ");
  classNamee = classNamee[0];
  let indexer=0;
  let x = 0;
  cities.splice(indexer);
  document.querySelector(`.${classNamee}`).remove();
  if (classNamee == document.querySelector(".content-name").innerText) {
          document.querySelector(".home").style.display = "block";
          document.querySelector(".page").style.display = "none";
  }
        let alert = document.querySelector(".delete-massage").style;
        alert.display = "block";
        setTimeout(() => (alert.display = "none"), 1000);
        x=0;
  }
 
//clear all massages
function clearAll() {
  setTimeout(() => {
    document.querySelector(".error").style.display = "none";
    document.querySelector(".error2").style.display = "none";
    document.querySelector(".success").style.display = "none";
  }, 2000);
}

let currentLat;
let currentLong;
document
  .querySelectorAll(".ip")
  .forEach((item) => item.addEventListener("click", findLucation));
function findLucation() {
  navigator.geolocation.getCurrentPosition((p) => {
    currentLat = p.coords.latitude;
    currentLong = p.coords.longitude;
  });

  setTimeout(() => {
    const data = ` https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLong}&appid=730f050925d480d9f65e24f9ee55f977`;
    fetch(data)
      .then((response) => response.json())
      .then((data) => {
        city = data.name;
        addcity();
      });
  }, 1000);
}

//show city page
function showCityPage(name) {
  const data = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=730f050925d480d9f65e24f9ee55f977&units=metric`;
  fetch(data)
    .then((response) => response.json())
    .then((data) => {
      currentLat = data.coord.lat;
      currentLong = data.coord.lon;
      const page = document.querySelector(".page");
      //set page time
      let pageHour;
      let pageMinute;
      let data2 = `https://api.ipgeolocation.io/timezone?apiKey=75f21a2b4bfe4c4db09214bd2c2a9f9e&lat=${currentLat}&long=${currentLong}`;
      fetch(data2)
        .then((response) => response.json())
        .then((data) => {
          //set clock for first time using api data
          let time = data.time_24;
          time = time.split(":");
          pageHour = Number(time[0]);
          setIcon(pageHour);
          pageMinute = Number(time[1]);
          if (pageHour == 24) pageHour = 0;
          if (pageMinute < 10) pageMinute = "0" + String(pageMinute);
          document.querySelector(
            ".clock"
          ).innerHTML = `${pageHour}:${pageMinute}`;

          //set page date
          let Date = data.date_time_txt;
          Date = Date.split(",");
          const Date2 = Date[1].split(" ");
          //check day for nd or st
          if (Number(Date2[2]) == 1) {
            document.querySelector(
              ".content-date"
            ).innerHTML = ` ${Date[0]},${Date2[2]}<sup>st</sup> ${Date2[1]}`;
          } else {
            document.querySelector(
              ".content-date"
            ).innerHTML = ` ${Date[0]},${Date2[2]}<sup>nd</sup> ${Date2[1]}`;
          }

          datepage = Date[0];
        });
      //update time every minutes
      setInterval(() => {
        setIcon(pageHour);
        if (pageMinute == 59) {
          pageHour++;
          pageMinute = 00;
        } else pageMinute++;
        if (pageHour == 24) pageHour = 0;
        if (pageMinute < 10) pageMinute = "0" + String(pageMinute);
        document.querySelector(
          ".clock"
        ).innerHTML = `${pageHour}:${pageMinute}`;
        pageMinute = Number(pageMinute);
      }, 60000);

      //set page weather description
      document.querySelector(".content-description").innerText =
        data.weather[0].description;

      document.querySelector(".content-name").innerText = name;
      document.querySelector(".content-deg").innerText =
        data.main.temp + `\u00B0`;
      //set icon for page
      function setIcon(pageHour) {
        if (Number(pageHour) >= 18 || Number(pageHour) <= 7) {
          document.querySelector(".fa-moon").style.display = "block";
          document.querySelector(".page").style.background =
            "linear-gradient(to top left  ,#454f81,#6ba0c0)";
        } else {
          document.querySelector(".fa-sun").style.display = "block";
          document.querySelector(".page").style.background =
            "linear-gradient(to top left, #d14d71, #e6ac7b)";
        }
      }

      // showPageHourlyTemp(name,currentLat,currentLong,pageHour);

      page.style.display = "block";
      document.querySelector(".home").style.display = "none";
      document.querySelector(".menu").classList.toggle("show");
      document.querySelector(".hamburger").classList.toggle("rotate");

      document.querySelector(".today").className = "today line";
      showPageHourlyTemp(name);
      document.querySelector(".this-week").className = "this-week";
      NamePage = name;
    })
    .catch(() => {});
}

//get time for page
//
//https://api.ipgeolocation.io/timezone?apiKey=75f21a2b4bfe4c4db09214bd2c2a9f9e&lat=-27.4748&long=153.017

// add event listener to home icon in page
document.querySelector(".home-button").addEventListener("click", () => {
  document.querySelector(".home").style.display = "block";
  document.querySelector(".page").style.display = "none";
});

//add event listener to show daily weather report
document.querySelector(".today").addEventListener("click", () => {
  document.querySelector(".today").className = "today line";
  showPageHourlyTemp(NamePage);
  document.querySelector(".this-week").className = "this-week";
});

//add event listenr to show weekly weather report
document.querySelector(".this-week").addEventListener("click", () => {
  document.querySelector(".this-week").className = "this-week line";
  showWeaklyWeather(NamePage, datepage);
  document.querySelector(".today").className = "today";
});

//make function to show hourly daily weather report
function showPageHourlyTemp(name) {
  let data3 = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=730f050925d480d9f65e24f9ee55f977&units=metric`;
  fetch(data3)
    .then((response) => response.json())
    .then((data) => {
      let list = data.list;
      let time = list[0].dt_txt;
      time = time.split(" ");
      time = time[1].split(":");
      time = time[0];
      let j = time;
      for (let i = 0; i < 5; i++) {
        let times = document.querySelectorAll(".info");
        times[i].innerText = `${j}:00`;
        j++;
        j++;
        j++;
        if (j > 24) j = j - 24;
        document.querySelectorAll(".dailyDeg")[i].innerText =
          Number(list[i].main.temp).toFixed(1) + "\u00B0";
      }
    })
    .catch(() => {});
}
// \u00B0
//make function to show weekly report of weather
function showWeaklyWeather(name, date) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let indexday;
  days.forEach((item, index) => {
    if (item == date) indexday = index;
  });
  let data3 = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=730f050925d480d9f65e24f9ee55f977&units=metric`;
  fetch(data3)
    .then((response) => response.json())
    .then((data) => {
      let list = data.list;
      let daily = 0;
      for (let i = 0; i < 5; i++) {
        if(indexday>6) indexday=indexday-7;
        let times = document.querySelectorAll(".info");
        times[i].innerText = dayday[indexday];
        indexday++;
        document.querySelectorAll(".dailyDeg")[i].innerText =
          Number(list[daily].main.temp).toFixed(1) + "\u00B0";
        daily = daily + 8;
      }
    })
    .catch(() => {});
}
