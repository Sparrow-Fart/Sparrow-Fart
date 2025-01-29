import "./style.css";
import Chart from "chart.js/auto";

const popularLocations = {
  A: ["Atlanta", "Austin", "Anchorage", "Albany", "Albuquerque", "Algeria"],
  B: [
    "Brooklyn",
    "Boston",
    "Boulder",
    "Baltimore",
    "Baton Rouge",
    "Bronx",
    "Botswana",
  ],
  C: [
    "Chicago",
    "Cleveland",
    "Columbus",
    "Charlotte",
    "Cincinnati",
    "Cameroon",
    "China",
  ],
  D: ["Dallas", "Denver", "Detroit", "Durham", "Des Moines"],
  E: ["El Paso", "Eugene", "Evansville", "Elizabeth", "Ecuador", "Egypt"],
  F: ["Fresno", "Fort Worth", "Fort Lauderdale", "Fairbanks", "Fiji"],
  G: ["Grand Rapids", "Greensboro", "Glendale", "Gainesville", "Ghana"],
  H: ["Houston", "Honolulu", "Huntsville", "Hartford", "Honduras"],
  I: ["Indianapolis", "Irvine", "Idaho Falls", "Inglewood"],
  J: ["Jacksonville", "Japan", "Jersey City", "Juneau", "Jackson", "Jamaica"],
  K: ["Kansas City", "Knoxville", "Kalamazoo", "Ketchikan", "Kenya"],
  L: ["Los Angeles", "Louisville", "Las Vegas", "Little Rock", "London"],
  M: ["Miami", "Milwaukee", "Memphis", "Minneapolis", "Mexico"],
  N: ["New York", "Nashville", "New Orleans", "Norfolk", "Nigeria"],
  O: ["Orlando", "Omaha", "Oakland", "Oklahoma City"],
  P: ["Philadelphia", "Phoenix", "Pittsburgh", "Portland", "Paris"],
  Q: ["Quincy", "Queens"],
  R: ["Raleigh", "Richmond", "Reno", "Rochester"],
  S: ["San Francisco", "San Diego", "Seattle", "Sacramento", "Staten Island"],
  T: ["Tampa", "Tucson", "Tulsa", "Toledo", "Trinidad & Tobago"],
  U: ["Utica", "Upland", "United Kingdom"],
  V: ["Virginia Beach", "Vancouver", "Visalia"],
  W: ["Washington D.C.", "Wichita", "Wilmington", "Waco"],
  X: ["Xenia"],
  Y: ["Yonkers", "Yuma"],
  Z: ["Zion"],
};

async function getGeoCoding(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching Geocoding");

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`Unable to get weather data for ${name}`);
    }

    const geoData = data.results[0];
    return {
      name: geoData.name,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function searchLocation(location) {
  if (!location || location.trim() === "") {
    alert("Please enter a valid location.");
    return;
  }

  getGeoCoding(location).then((geoData) => {
    if (geoData) {
      const { latitude, longitude } = geoData;
      fetchSunTimes(latitude, longitude);
      fetchWeeklyData(latitude, longitude);
      fetchLocationImage(location);
    } else {
      alert("Location not found");
    }
  });
}

async function fetchSunTimes(lat, lng) {
  const response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
  );
  const data = await response.json();
  //console.log(newdate(data.results.sunrise, data.results.sunset));
  const sunrise = new Date(data.results.sunrise);
  const sunset = new Date(data.results.sunset);

  document.getElementById("sunrise-time").textContent = sunrise.toLocaleString(
    "en-US",
    {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );
  document.getElementById("sunset-time").textContent = sunset.toLocaleString(
    "en-US",
    {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  updateBackground(sunrise.getHours(), sunset.getHours());
  console.log(sunrise, sunset);
}

// function displayData(event) {
//   // event.preventDefault();
//   let main = document.getElementById("sun-times");

//   if (main.style.display === "") {
//     main.style.display = "block";
//     console.log(main.style);
//   }
// }

// document
//   .getElementById("location-input")
//   .addEventListener("submit", displayData);
let myChart = null;

async function fetchWeeklyData(lat, lng) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=sunrise,sunset&timezone=auto`
    );

    if (!response.ok) {
      throw new Error("Error fetching weekly data");
    }

    const data = await response.json();

    const dates = data.daily.time;
    const sunriseTimes = data.daily.sunrise;
    const sunsetTimes = data.daily.sunset;

    // Parse times and calculate the duration of daylight for each day
    const daylightDurations = dates.map((date, index) => {
      const sunrise = new Date(sunriseTimes[index]);
      const sunset = new Date(sunsetTimes[index]);

      // Calculate daylight duration in hours
      const daylightDuration = (sunset - sunrise) / 1000 / 60 / 60; // in hours
      return {
        date: new Date(date),
        daylightDuration,
      };
    });

    // Find the shortest and longest day
    const shortestDay = daylightDurations.reduce((prev, current) =>
      prev.daylightDuration < current.daylightDuration ? prev : current
    );
    const longestDay = daylightDurations.reduce((prev, current) =>
      prev.daylightDuration > current.daylightDuration ? prev : current
    );

    // Format and display the shortest and longest days
    const shortestDayName = shortestDay.date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const longestDayName = longestDay.date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // Update the UI with the shortest and longest day information
    document.getElementById(
      "Shortest-day"
    ).textContent = `Shortest Day: ${shortestDayName} - ${shortestDay.daylightDuration.toFixed(
      2
    )} hours`;
    document.getElementById(
      "Longest-day"
    ).textContent = `Longest Day: ${longestDayName} - ${longestDay.daylightDuration.toFixed(
      2
    )} hours`;

    // Update the chart (optional) for sunrise/sunset times this week
    const labels = dates.map((date) =>
      new Date(date).toLocaleDateString("en-US", { weekday: "short" })
    );
    const sunriseHours = sunriseTimes.map((time) => new Date(time).getHours());
    const sunsetHours = sunsetTimes.map((time) => new Date(time).getHours());

    if (myChart) myChart.destroy();

    const ctx = document.getElementById("sun-chart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Sunrise",
            data: sunriseHours,
            borderColor: "orange",
          },
          {
            label: "Sunset",
            data: sunsetHours,
            borderColor: "purple",
          },
        ],
      },
      options: { responsive: true },
    }).innerHTML;
  } catch (err) {
    console.error(err);
  }
}

// async function fetchWeeklyData(lat, lng) {
//   try {
//     const response = await fetch(
//       `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=sunrise,sunset&timezone=auto`
//     );

//     if (!response.ok) {
//       throw new Error("Error fetching weekly data");
//     }

//     const data = await response.json();

//     const dates = data.daily.time;
//     const sunriseHours = data.daily.sunrise.map((time) =>
//       new Date(time).getHours()
//

function selectSuggestion(location) {
  document.getElementById("location").value = location;
  document.getElementById("suggestions").style.display = "none";
  searchLocation(location);
}

function showSuggestions(input) {
  const suggestionBox = document.getElementById("suggestions");
  const suggestionList = document.getElementById("suggestion-list");

  if (!input) {
    suggestionBox.style.display = "none";
    return;
  }

  const firstLetter = input[0].toUpperCase();

  if (popularLocations[firstLetter]) {
    suggestionBox.style.display = "block";
    suggestionList.innerHTML = "";
    popularLocations[firstLetter].forEach((location) => {
      const li = document.createElement("li");
      li.textContent = location;
      li.addEventListener("click", () => selectSuggestion(location));
      suggestionList.appendChild(li);
    });
  } else {
    suggestionBox.style.display = "none";
  }
}

document.getElementById("location").addEventListener("input", (event) => {
  showSuggestions(event.target.value);
});

document.addEventListener("click", (event) => {
  // maybe bc im coding at 5am but i dont get why i have to rewrite this function if its been decalred above but hey, whatever works
  const suggestionBox = document.getElementById("suggestions");
  const locationInput = document.getElementById("location");

  if (
    !locationInput.contains(event.target) &&
    !suggestionBox.contains(event.target)
  ) {
    suggestionBox.style.display = "none";
  }
});

async function fetchLocationImage(query) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_UNSPLASH_API_KEY`
  );
  const data = await response.json();

  if (data.results.length > 0) {
    const img = document.getElementById("location-image");
    img.src = data.results[0].urls.regular;
    img.style.display = "block";
  }
}

function updateBackground(sunrise, sunset) {
  const currentTime = new Date();
  // hours but in 24hr format
  const currentHour = currentTime.getHours();

  // sttring splitting following previous code challenge so hrs and mins separate
  // const [sunriseHour] = sunrise.split(":").map(Number);
  // const [sunsetHour] = sunset.split(":").map(Number);

  const updateText = document.getElementById("first-header");
  const updateHeaderBkgrd = document.getElementById("header");
  const updateSuntimes = document.getElementById("sun-times");
  const updateSunriseTitle = document.getElementById("sunrise-title");
  const updateSunsetTitle = document.getElementById("sunset-title");
  const updateSunriseTime = document.getElementById("sunrise-time");
  const updateSunsetTime = document.getElementById("sunset-time");
  const updateLocationInput = document.getElementById("location");
  console.log(currentHour, sunrise);
  if (currentHour < sunrise) {
    document.body.style.background =
      "linear-gradient(to bottom, #0e1b44 0%, #3d3e85 100%)";
    updateHeaderBkgrd.style.background =
      "linear-gradient(to bottom, #0e1b44 0%,#3d3e8500 100%)";
    updateSuntimes.style.background = "#0e1b44";
    updateSunriseTitle.style.background = "#0e1b44";
    updateSunsetTitle.style.background = "#0e1b44";
    updateSunriseTime.style.background = "#0e1b44";
    updateSunsetTime.style.background = "#0e1b44";
    updateLocationInput.style.background = "#0e1b44";

    // checking if the sunrise is an hour away - or + tthis is just for more variations
  } else if (currentHour >= sunrise - 1 && currentHour < sunrise + 1) {
    document.body.style.background =
      "linear-gradient(to bottom, #9bb1ca 0%, #f7a821 100%)";
    updateHeaderBkgrd.style.background =
      "linear-gradient(to bottom, #9bb1ca 80%, #f7a92100 100%)";
    updateSuntimes.style.background = "#9bb1ca";
    updateSunriseTitle.style.background = "#9bb1ca";
    updateSunsetTitle.style.background = "#9bb1ca";
    updateSunriseTime.style.background = "#9bb1ca";
    updateSunsetTime.style.background = "#9bb1ca";

    //this one is for general daytime
  } else if (currentHour >= sunrise && currentHour < sunset) {
    document.body.style.background =
      "linear-gradient(to bottom, #0185ad 0%, #3a7fc6 100%)";
    updateHeaderBkgrd.style.background =
      "linear-gradient(to bottom, #0185ad 80%,rgba(58, 128, 198, 0) 100%)";
    updateSuntimes.style.background = "#0185ad";
    updateSunriseTitle.style.background = "#0185ad";
    updateSunsetTitle.style.background = "#0185ad";
    updateSunriseTime.style.background = "#0185ad";
    updateSunsetTime.style.background = "#0185ad";
    console.log("updating location input style");
    updateLocationInput.style.background = "rgb(33, 153, 189);";

    // same as sunrise hour check
  } else if (currentHour >= sunset - 1 && currentHour < sunset + 1) {
    document.body.style.background =
      "linear-gradient(to bottom, #ad4850 0%, #f6c859 100%)";
    updateHeaderBkgrd.style.background =
      "linear-gradient(to bottom, #ad4850 80%,rgba(246, 199, 89, 0) 100%)";
    updateSuntimes.style.background = "#ad4850";
    updateSunriseTitle.style.background = "#ad4850";
    updateSunsetTitle.style.background = "#ad4850";
    updateSunriseTime.style.background = "#ad4850";
    updateSunsetTime.style.background = "#ad4850";
  } else {
    document.body.style.background =
      "linear-gradient(to bottom, #350f68 0%, #193eae 100%)";
    updateHeaderBkgrd.style.background =
      "linear-gradient(to bottom, #350f68 80%, #3d3e8500 100%)";
    updateSuntimes.style.background = "#350f68";
    updateSunriseTitle.style.background = "#350f68";
    updateSunsetTitle.style.background = "#350f68";
    updateSunriseTime.style.background = "#350f68";
    updateSunsetTime.style.background = "#350f68";
  }
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("first-header").style.fontSize = "30px";
    document.getElementById("first-p").style.fontSize = "15px";
  } else {
    document.getElementById("first-header").style.fontSize = "90px";
    document.getElementById("first-header").style.fontSize = "45px";
  }
}
