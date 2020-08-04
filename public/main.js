let form = document.querySelector("form");
let h1 = document.querySelector("h1");
let img = document.querySelector("img");

form.addEventListener("submit", event => {
  event.preventDefault();

  let city = event.target.elements.city.value.trim();

  fetch("/" + city, {header: {"Content-Type": "application/json"}}).then(res => res.text())
  .then(body => {
    let data = JSON.parse(body);
    h1.textContent = `It is now ${data.temperature}${String.fromCharCode(176)}C, \
with ${data.situation} and humid level of ${data.humidity}, in \
${data.city}, ${data.country}.`;
    img.src = `/${data.icon}.png`;
  });
});
