window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("header").style.fontSize = "30px";
  } else {
    document.getElementById("header").style.fontSize = "70px";
  }
}

function displayData(event) {
  event.preventDefault();
  let main = document.getElementById("main-content");

  if (main.style.display === "") {
    main.style.display = "block";
    console.log(main.style);
  }
}

document
  .getElementById("location-form")
  .addEventListener("submit", displayData);

// function fadeIn() {
//   document.getElementById("btn").addEventListener("click");
// }

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
