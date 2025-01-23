import "./style.css";
// const popularLocations = {
//   A: ["Atlanta", "Austin", "Anchorage", "Albany", "Albuquerque"],
//   B: ["Brooklyn", "Boston", "Boulder", "Baltimore", "Baton Rouge", "Bronx"],
//   C: ["Chicago", "Cleveland", "Columbus", "Charlotte", "Cincinnati"],
//   D: ["Dallas", "Denver", "Detroit", "Durham", "Des Moines"],
//   E: ["El Paso", "Eugene", "Evansville", "Elizabeth"],
//   F: ["Fresno", "Fort Worth", "Fort Lauderdale", "Fairbanks"],
//   G: ["Grand Rapids", "Greensboro", "Glendale", "Gainesville"],
//   H: ["Houston", "Honolulu", "Huntsville", "Hartford"],
//   I: ["Indianapolis", "Irvine", "Idaho Falls", "Inglewood"],
//   J: ["Jacksonville", "Jersey City", "Juneau", "Jackson"],
//   K: ["Kansas City", "Knoxville", "Kalamazoo", "Ketchikan"],
//   L: ["Los Angeles", "Louisville", "Las Vegas", "Little Rock"],
//   M: ["Miami", "Milwaukee", "Memphis", "Minneapolis"],
//   N: ["New York", "Nashville", "New Orleans", "Norfolk"],
//   O: ["Orlando", "Omaha", "Oakland", "Oklahoma City"],
//   P: ["Philadelphia", "Phoenix", "Pittsburgh", "Portland"],
//   Q: ["Quincy", "Queens"],
//   R: ["Raleigh", "Richmond", "Reno", "Rochester"],
//   S: ["San Francisco", "San Diego", "Seattle", "Sacramento", "Staten Island"],
//   T: ["Tampa", "Tucson", "Tulsa", "Toledo"],
//   U: ["Utica", "Upland"],
//   V: ["Virginia Beach", "Vancouver", "Visalia"],
//   W: ["Washington D.C.", "Wichita", "Wilmington", "Waco"],
//   X: ["Xenia"],
//   Y: ["Yonkers", "Yuma"],
//   Z: ["Zion"],
// };

// async function getGeoCoding(name) {
//   const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error("Error fetching Geocoding");

//     const data = await response.json();
//     if (!data.results || data.results.length === 0) {
//       throw new Error(`Unable to get weather data for ${name}`);
//     }

//     const geoData = data.results[0];
//     return {
//       name: geoData.name,
//       latitude: geoData.latitude,
//       longitude: geoData.longitude,
//     };
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// function searchLocation(location) {
//   if (!location || location.trim() === "") {
//     alert("Please enter a valid location.");
//     return;
//   }

//   getGeoCoding(location).then((geoData) => {
//     if (geoData) {
//       const { latitude, longitude } = geoData;
//       fetchSunTimes(latitude, longitude);
//       fetchWeeklyData(latitude, longitude);
//       fetchLocationImage(location);
//     } else {
//       alert("Location not found");
//     }
//   });
// }

// async function fetchSunTimes(lat, lng) {
//   const response = await fetch(
//     `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
//   );
//   const data = await response.json();

//   const sunrise = new Date(data.results.sunrise).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const sunset = new Date(data.results.sunset).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   document.getElementById("sunrise-time").textContent = sunrise;
//   document.getElementById("sunset-time").textContent = sunset;

//   updateBackground(sunrise, sunset);
// }

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
//     );
//     const sunsetHours = data.daily.sunset.map((time) =>
//       new Date(time).getHours()
//     );

//     const labels = dates.map((date) =>
//       new Date(date).toLocaleDateString("en-US", { weekday: "short" })
//     );

//     const ctx = document.getElementById("sun-chart").getContext("2d");
//     new Chart(ctx, {
//       type: "line",
//       data: {
//         labels,
//         datasets: [
//           {
//             label: "Sunrise",
//             data: sunriseHours,
//             borderColor: "orange",
//           },
//           {
//             label: "Sunset",
//             data: sunsetHours,
//             borderColor: "purple",
//           },
//         ],
//       },
//       options: { responsive: true },
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// function selectSuggestion(location) {
//   document.getElementById("location").value = location;
//   document.getElementById("suggestions").style.display = "none";
//   searchLocation(location);
// }

// function showSuggestions(input) {
//   const suggestionBox = document.getElementById("suggestions");
//   const suggestionList = document.getElementById("suggestion-list");

//   if (!input) {
//     suggestionBox.style.display = "none";
//     return;
//   }

//   const firstLetter = input[0].toUpperCase();

//   if (popularLocations[firstLetter]) {
//     suggestionBox.style.display = "block";
//     suggestionList.innerHTML = popularLocations[firstLetter]
//       .map(
//         (location) =>
//           `<li onclick="selectSuggestion('${location}')">${location}</li>`
//       )
//       .join("");
//   } else {
//     suggestionBox.style.display = "none";
//   }
// }

// document.getElementById("location").addEventListener("input", (event) => {
//   showSuggestions(event.target.value);
// });

// document.getElementById("search-button").addEventListener("click", () => {
//   const location = document.getElementById("location").value.trim();
//   if (location) {
//     searchLocation(location);
//   }
// });

// async function fetchLocationImage(query) {
//   const response = await fetch(
//     `https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_UNSPLASH_API_KEY`
//   );
//   const data = await response.json();

//   if (data.results.length > 0) {
//     const img = document.getElementById("location-image");
//     img.src = data.results[0].urls.regular;
//     img.style.display = "block";
//   }
// }

// function updateBackground(sunrise, sunset) {
//   const currentTime = new Date();
//   const sunriseTime = new Date(`1970-01-01T${sunrise}Z`);
//   const sunsetTime = new Date(`1970-01-01T${sunset}Z`);

//   if (currentTime < sunriseTime) {
//     document.body.style.background = "url('dawn.jpg')";
//   } else if (currentTime < sunsetTime) {
//     document.body.style.background = "url('day.jpg')";
//   } else {
//     document.body.style.background = "url('night.jpg')";
//   }
// }

const popularLocations = {
  A: ["Atlanta", "Austin", "Anchorage", "Albany", "Albuquerque"],
  B: ["Brooklyn", "Boston", "Boulder", "Baltimore", "Baton Rouge", "Bronx"],
  C: ["Chicago", "Cleveland", "Columbus", "Charlotte", "Cincinnati"],
  D: ["Dallas", "Denver", "Detroit", "Durham", "Des Moines"],
  E: ["El Paso", "Eugene", "Evansville", "Elizabeth", "Ecuador"],
  F: ["Fresno", "Fort Worth", "Fort Lauderdale", "Fairbanks"],
  G: ["Grand Rapids", "Greensboro", "Glendale", "Gainesville"],
  H: ["Houston", "Honolulu", "Huntsville", "Hartford"],
  I: ["Indianapolis", "Irvine", "Idaho Falls", "Inglewood"],
  J: ["Jacksonville", "Japan", "Jersey City", "Juneau", "Jackson"],
  K: ["Kansas City", "Knoxville", "Kalamazoo", "Ketchikan"],
  L: ["Los Angeles", "Louisville", "Las Vegas", "Little Rock"],
  M: ["Miami", "Milwaukee", "Memphis", "Minneapolis", "Mexico"],
  N: ["New York", "Nashville", "New Orleans", "Norfolk"],
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

  const sunrise = new Date(data.results.sunrise).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(data.results.sunset).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("sunrise-time").textContent = sunrise + " ET";
  document.getElementById("sunset-time").textContent = sunset + " ET";

  updateBackground(sunrise, sunset);
}

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
    const sunriseHours = data.daily.sunrise.map((time) =>
      new Date(time).getHours()
    );
    const sunsetHours = data.daily.sunset.map((time) =>
      new Date(time).getHours()
    );

    const labels = dates.map((date) =>
      new Date(date).toLocaleDateString("en-US", { weekday: "short" })
    );

    const ctx = document.getElementById("sun-chart").getContext("2d");
    new Chart(ctx, {
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
    });
  } catch (err) {
    console.error(err);
  }
}

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

document.getElementById("search-button").addEventListener("click", () => {
  const location = document.getElementById("location").value.trim();
  if (location) {
    searchLocation(location);
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
  const sunriseTime = new Date(`1970-01-01T${sunrise}Z`);
  const sunsetTime = new Date(`1970-01-01T${sunset}Z`);

  if (currentTime < sunriseTime) {
    document.body.style.background = "url('dawn.jpg')";
  } else if (currentTime < sunsetTime) {
    document.body.style.background = "url('day.jpg')";
  } else {
    document.body.style.background = "url('night.jpg')";
  }
}
// const popularLocations = {
//   A: ["Atlanta", "Austin", "Anchorage", "Albany", "Albuquerque"],
//   B: ["Brooklyn", "Boston", "Boulder", "Baltimore", "Baton Rouge", "Bronx"],
//   C: ["Chicago", "Cleveland", "Columbus", "Charlotte", "Cincinnati"],
//   D: ["Dallas", "Denver", "Detroit", "Durham", "Des Moines"],
//   E: ["El Paso", "Eugene", "Evansville", "Elizabeth", "Ecuador"],
//   F: ["Fresno", "Fort Worth", "Fort Lauderdale", "Fairbanks"],
//   G: ["Grand Rapids", "Greensboro", "Glendale", "Gainesville"],
//   H: ["Houston", "Honolulu", "Huntsville", "Hartford"],
//   I: ["Indianapolis", "Irvine", "Idaho Falls", "Inglewood"],
//   J: ["Jacksonville", "Japan", "Jersey City", "Juneau", "Jackson"],
//   K: ["Kansas City", "Knoxville", "Kalamazoo", "Ketchikan"],
//   L: ["Los Angeles", "Louisville", "Las Vegas", "Little Rock"],
//   M: ["Miami", "Milwaukee", "Memphis", "Minneapolis", "Mexico"],
//   N: ["New York", "Nashville", "New Orleans", "Norfolk"],
//   O: ["Orlando", "Omaha", "Oakland", "Oklahoma City"],
//   P: ["Philadelphia", "Phoenix", "Pittsburgh", "Portland", "Paris"],
//   Q: ["Quincy", "Queens"],
//   R: ["Raleigh", "Richmond", "Reno", "Rochester"],
//   S: ["San Francisco", "San Diego", "Seattle", "Sacramento", "Staten Island"],
//   T: ["Tampa", "Tucson", "Tulsa", "Toledo", "Trinidad & Tobago"],
//   U: ["Utica", "Upland", "United Kingdom"],
//   V: ["Virginia Beach", "Vancouver", "Visalia"],
//   W: ["Washington D.C.", "Wichita", "Wilmington", "Waco"],
//   X: ["Xenia"],
//   Y: ["Yonkers", "Yuma"],
//   Z: ["Zion"],
// };

// async function getGeoCoding(name) {
//   const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error("Error fetching Geocoding");

//     const data = await response.json();
//     if (!data.results || data.results.length === 0) {
//       throw new Error(`Unable to get weather data for ${name}`);
//     }

//     const geoData = data.results[0];
//     return {
//       name: geoData.name,
//       latitude: geoData.latitude,
//       longitude: geoData.longitude,
//     };
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }

// async function fetchSunTimes(lat, lng) {
//   const response = await fetch(
//     `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
//   );
//   const data = await response.json();

//   const sunrise = new Date(data.results.sunrise).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
//   const sunset = new Date(data.results.sunset).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   document.getElementById("sunrise-time").textContent = sunrise + " ET";
//   document.getElementById("sunset-time").textContent = sunset + " ET";

//   updateBackground(sunrise, sunset);
// }

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
//     const sunriseTimes = data.daily.sunrise.map((time) => new Date(time));
//     const sunsetTimes = data.daily.sunset.map((time) => new Date(time));

//     // Calculate daylight durations
//     const daylightDurations = sunriseTimes.map((sunrise, i) => {
//       const sunset = sunsetTimes[i];
//       const durationInMs = sunset - sunrise;
//       const hours = Math.floor(durationInMs / (1000 * 60 * 60));
//       const minutes = Math.floor(
//         (durationInMs % (1000 * 60 * 60)) / (1000 * 60)
//       );
//       return { date: dates[i], hours, minutes, durationInMs };
//     });

//     // Find the shortest and longest day
//     const shortestDay = daylightDurations.reduce((a, b) =>
//       a.durationInMs < b.durationInMs ? a : b
//     );
//     const longestDay = daylightDurations.reduce((a, b) =>
//       a.durationInMs > b.durationInMs ? a : b
//     );

//     // Display shortest and longest day info
//     document.getElementById("Shortest-day").textContent = `Shortest Day: ${
//       shortestDay.hours
//     } hrs ${shortestDay.minutes} mins on ${new Date(
//       shortestDay.date
//     ).toLocaleDateString("en-US", { weekday: "long" })}`;

//     document.getElementById("Longest-day").textContent = `Longest Day: ${
//       longestDay.hours
//     } hrs ${longestDay.minutes} mins on ${new Date(
//       longestDay.date
//     ).toLocaleDateString("en-US", { weekday: "long" })}`;

//     // Update the chart
//     const labels = dates.map((date) =>
//       new Date(date).toLocaleDateString("en-US", { weekday: "short" })
//     );

//     const sunriseHours = sunriseTimes.map((time) => time.getHours());
//     const sunsetHours = sunsetTimes.map((time) => time.getHours());

//     const ctx = document.getElementById("sun-chart").getContext("2d");
//     new Chart(ctx, {
//       type: "line",
//       data: {
//         labels,
//         datasets: [
//           {
//             label: "Sunrise",
//             data: sunriseHours,
//             borderColor: "orange",
//           },
//           {
//             label: "Sunset",
//             data: sunsetHours,
//             borderColor: "purple",
//           },
//         ],
//       },
//       options: { responsive: true },
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// function searchLocation(location) {
//   if (!location || location.trim() === "") {
//     alert("Please enter a valid location.");
//     return;
//   }

//   getGeoCoding(location).then((geoData) => {
//     if (geoData) {
//       const { latitude, longitude } = geoData;
//       fetchSunTimes(latitude, longitude);
//       fetchWeeklyData(latitude, longitude);
//     } else {
//       alert("Location not found");
//     }
//   });
// }

// // Initialize data for the default location
// document.addEventListener("DOMContentLoaded", () => {
//   const defaultLocation = "New York";
//   getGeoCoding(defaultLocation).then((geoData) => {
//     if (geoData) {
//       const { latitude, longitude } = geoData;
//       fetchSunTimes(latitude, longitude);
//       fetchWeeklyData(latitude, longitude);
//     } else {
//       alert("Unable to fetch data for the default location");
//     }
//   });
// });
