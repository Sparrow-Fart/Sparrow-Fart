import "./style.css";
const popularLocations = {
  A: ["Atlanta", "Austin", "Anchorage", "Albany", "Albuquerque"],
  B: ["Brooklyn", "Boston", "Boulder", "Baltimore", "Baton Rouge"],
  C: ["Chicago", "Cleveland", "Columbus", "Charlotte", "Cincinnati"],
  D: ["Dallas", "Denver", "Detroit", "Durham", "Des Moines"],
  E: ["El Paso", "Eugene", "Evansville", "Elizabeth"],
  F: ["Fresno", "Fort Worth", "Fort Lauderdale", "Fairbanks"],
  G: ["Grand Rapids", "Greensboro", "Glendale", "Gainesville"],
  H: ["Houston", "Honolulu", "Huntsville", "Hartford"],
  I: ["Indianapolis", "Irvine", "Idaho Falls", "Inglewood"],
  J: ["Jacksonville", "Jersey City", "Juneau", "Jackson"],
  K: ["Kansas City", "Knoxville", "Kalamazoo", "Ketchikan"],
  L: ["Los Angeles", "Louisville", "Las Vegas", "Little Rock"],
  M: ["Miami", "Milwaukee", "Memphis", "Minneapolis"],
  N: ["New York", "Nashville", "New Orleans", "Norfolk"],
  O: ["Orlando", "Omaha", "Oakland", "Oklahoma City"],
  P: ["Philadelphia", "Phoenix", "Pittsburgh", "Portland"],
  Q: ["Quincy"],
  R: ["Raleigh", "Richmond", "Reno", "Rochester"],
  S: ["San Francisco", "San Diego", "Seattle", "Sacramento"],
  T: ["Tampa", "Tucson", "Tulsa", "Toledo"],
  U: ["Utica", "Upland"],
  V: ["Virginia Beach", "Vancouver", "Visalia"],
  W: ["Washington D.C.", "Wichita", "Wilmington", "Waco"],
  X: ["Xenia"],
  Y: ["Yonkers", "Yuma"],
  Z: ["Zion"],
};

async function fetchSunTimes(lat, lng) {
  const response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
  );
  const data = await response.json();

  const sunrise = new Date(data.results.sunrise).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(data.results.sunset).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("sunrise-time").textContent = sunrise;
  document.getElementById("sunset-time").textContent = sunset;

  updateBackground(sunrise, sunset);
}

async function fetchLocationImage(query) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_UNSPLASH_API_KEY`
  );
  const data = await response.json();

  if (data.results.length > 0) {
    const imageUrl = data.results[0].urls.regular;
    const imageElement = document.getElementById("location-image");
    imageElement.src = imageUrl;
    imageElement.style.display = "block";
  }
}

function updateBackground(sunrise, sunset) {
  const currentTime = new Date();
  const sunriseTime = new Date(`1970-01-01T${sunrise}Z`);
  const sunsetTime = new Date(`1970-01-01T${sunset}Z`);

  if (currentTime < sunriseTime) {
    document.body.style.backgroundImage = "url('dawn.jpg')";
  } else if (currentTime >= sunriseTime && currentTime < sunsetTime) {
    document.body.style.backgroundImage = "url('day.jpg')";
  } else {
    document.body.style.backgroundImage = "url('night.jpg')";
  }
}

async function fetchWeeklyData(lat, lng) {
  const data = [];
  const labels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sunriseTimes = ["6:30", "6:28", "6:27", "6:25", "6:24", "6:22", "6:21"];
  const sunsetTimes = ["7:45", "7:43", "7:42", "7:40", "7:38", "7:36", "7:35"];

  const ctx = document.getElementById("sun-chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Sunrise Time",
          data: sunriseTimes.map((time) => {
            const [hour, minute] = time.split(":").map(Number);
            return hour + minute / 60;
          }),
          borderColor: "orange",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "Sunset Time",
          data: sunsetTimes.map((time) => {
            const [hour, minute] = time.split(":").map(Number);
            return hour + minute / 60;
          }),
          borderColor: "purple",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
  });
}

function showSuggestions(input) {
  const firstLetter = input[0]?.toUpperCase();
  const suggestionBox = document.getElementById("location-suggestions");
  const suggestionList = document.getElementById("suggestion-list");

  if (popularLocations[firstLetter]) {
    suggestionBox.style.display = "block";
    suggestionList.innerHTML = popularLocations[firstLetter]
      .map((item) => `<li onclick="selectSuggestion('${item}')">${item}</li>`)
      .join("");
  } else {
    suggestionBox.style.display = "none";
    suggestionList.innerHTML = "";
  }
}

function selectSuggestion(location) {
  document.getElementById("location").value = location;
  document.getElementById("location-suggestions").style.display = "none";
  // reminder functionality to fetch sunrise/sunset times based on location here !!!!!
}
