const API_URL = 'https://api.openweathermap.org/data/2.5/weather?appid=ec117e367de727a63b1b4dca7a98f7fa&units=metric&lang=en&q=';

const API_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast?appid=ec117e367de727a63b1b4dca7a98f7fa&units=metric&lang=en&cnt=17&q=';

const API_URL_ICON = 'https://openweathermap.org/img/wn/';


//Obtiene el clima actual de Bogotá y manipula el DOM para agregar elementos
function handleRequestBta(){
    if(this.readyState === 4 && this.status === 200){
        const data = JSON.parse(this.response);

        const bannerIcon = document.querySelector('.banner__condition-icon');
        bannerIcon.src = `${API_URL_ICON}${data.weather[0].icon}.png`

        const bannerStatus = document.querySelector('.banner__condition-text');
        bannerStatus.textContent = data.weather[0].main;

        const bannerTemperature = document.querySelector('.banner__temperature');
        bannerTemperature.textContent = Math.floor(data.main.temp);

        const centigradeSpan = document.createElement('span');
        centigradeSpan.classList.add('banner__centigrades');
        centigradeSpan.textContent = '°C';
        bannerTemperature.appendChild(centigradeSpan);
    }
}


//Obtiene el clima de Bogotá por los 3 días siguientes y manipula el DOM para agregar elementos
function handleRequestBtaForecast(){
    if(this.readyState === 4 && this.status === 200){
        const data = JSON.parse(this.response);

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        var dateOne = new Date(data.list[0].dt_txt);
        var dateTwo = new Date(data.list[8].dt_txt);
        var dateThree = new Date(data.list[16].dt_txt);

        var firstDay = days[dateOne.getDay()];
        var secondDay = days[dateTwo.getDay()];
        var thirdDay = days[dateThree.getDay()];

        const daysNames = [firstDay, secondDay, thirdDay];

        const index = [0, 8, 16]

        const nodes = [];

        for(let i = 0; i < 3; i++){

            const day = document.createElement('p');
            day.classList.add('card__day');
            day.textContent = daysNames[i];

            const dayState = document.createElement('p');
            dayState.classList.add('card__state');
            dayState.textContent = data.list[index[i]].weather[0].main;

            const weather = document.createElement('div');
            weather.classList.add('card__weather');
            weather.append(day, dayState);

            const icon = document.createElement('img');
            icon.classList.add('card__icon');
            icon.src = `${API_URL_ICON}${data.list[index[i]].weather[0].icon}.png`;

            const iconContainer = document.createElement('div');
            iconContainer.classList.add('card__icon-container');
            iconContainer.appendChild(icon);

            const cardLeft = document.createElement('div');
            cardLeft.classList.add('card__left');
            cardLeft.append(iconContainer, weather);

            const cardRight = document.createElement('div');
            cardRight.classList.add('card__right');
            
            i === 0 ? cardRight.classList.add('card__right--first') : '';

            const cardTemperatureOne = document.createElement('p');
            cardTemperatureOne.classList.add('card__temperature');
            cardTemperatureOne.textContent = Math.ceil(data.list[index[i]].main.temp_max);

            const centigradeSpanOne = document.createElement('span');
            centigradeSpanOne.classList.add('card__centigrades');
            centigradeSpanOne.textContent = '°';

            cardRight.append(cardTemperatureOne, centigradeSpanOne);

            const cardTemperatureTwo = document.createElement('p');
            cardTemperatureTwo.classList.add('card__temperature');
            cardTemperatureTwo.textContent = ` / ${Math.floor(data.list[index[i]].main.temp_min)}`;

            const centigradeSpanTwo = document.createElement('span');
            centigradeSpanTwo.classList.add('card__centigrades');
            centigradeSpanTwo.textContent = '°';

            cardRight.append(cardTemperatureTwo, centigradeSpanTwo);


            const card = document.createElement('div');
            card.classList.add('card');
            card.append(cardLeft, cardRight);

            nodes.push(card);
        }

        const forecast = document.querySelector('.forecast');
        forecast.append(...nodes);

    }
}

//Obtiene el clima actual por ciudades (Paris y Madrid) y manipula el DOM para agregar elementos
function handleRequestCity(){
    if(this.readyState === 4 && this.status === 200){
        const data = JSON.parse(this.response);

        const icon = document.createElement('img');
        icon.classList.add('city-card__icon');
        icon.src = `${API_URL_ICON}${data.weather[0].icon}.png`;

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('city-card__icon-container');
        iconContainer.appendChild(icon);

        const upCard = document.createElement('div');
        upCard.classList.add('city-card__up');
        upCard.appendChild(iconContainer);

        const centigradeSpan = document.createElement('span');
        centigradeSpan.classList.add('city-card__centigrades');
        centigradeSpan.textContent = 'C°';

        const temperature = document.createElement('p');
        temperature.classList.add('city-card__temperature');
        temperature.textContent = Math.floor(data.main.temp);
        temperature.appendChild(centigradeSpan);

        upCard.appendChild(temperature);

        const city = document.createElement('p');
        city.classList.add('city-card__city');
        city.textContent = data.name;

        const country = document.createElement('p');
        country.classList.add('city-card__country');
        country.textContent = (data.sys.country === 'FR' ? 'France' : 'Spain');

        const place = document.createElement('div');
        place.classList.add('city-card__place');
        place.append(city, country);

        upCard.appendChild(place);

        const downCard = document.createElement('div');
        downCard.classList.add('city-card__down');

        const humidity = document.createElement('p');
        humidity.classList.add('city-card__text');
        humidity.textContent = `Humidity ${data.main.humidity}%`;

        const windDirection = document.createElement('p');
        windDirection.classList.add('city-card__text');

        let dir = '';

        if(data.wind.deg >= 348.75 || data.wind.deg <= 11.25){
            dir = 'North';
        }
        if(data.wind.deg >= 168.75 && data.wind.deg <= 191.25){
            dir = 'South';
        }
        if(data.wind.deg >= 78.75 && data.wind.deg <= 101.25){
            dir = 'East';
        }
        if(data.wind.deg >= 258.75 && data.wind.deg <= 281.25){
            dir = 'West';
        }
        if(data.wind.deg >= 33.75 && data.wind.deg <= 56.25){
            dir = 'Northeast';
        }
        if(data.wind.deg >= 123.75 && data.wind.deg <= 146.25){
            dir = 'Southeast';
        }
        if(data.wind.deg >= 303.75 && data.wind.deg <= 326.25){
            dir = 'Northwest';
        }
        if(data.wind.deg >= 213.75 && data.wind.deg <= 236.25){
            dir = 'Southwest';
        }
        if(data.wind.deg >= 11.26 && data.wind.deg <= 33.74){
            dir = 'North-Northeast';
        }
        if(data.wind.deg >= 56.26 && data.wind.deg <= 78.74){
            dir = 'East-Northeast';
        }
        if(data.wind.deg >= 101.26 && data.wind.deg <= 123.74){
            dir = 'East-Southeast';
        }
        if(data.wind.deg >= 146.26 && data.wind.deg <= 168.74){
            dir = 'South-Southeast';
        }
        if(data.wind.deg >= 191.26 && data.wind.deg <= 213.74){
            dir = 'South-Southwest';
        }
        if(data.wind.deg >= 236.26 && data.wind.deg <= 258.74){
            dir = 'West-Southwest';
        }
        if(data.wind.deg >= 281.26 && data.wind.deg <= 303.74){
            dir = 'West-Northwest';
        }
        if(data.wind.deg >= 326.26 && data.wind.deg <= 348.74){
            dir = 'North-Northwest';
        }

        windDirection.textContent = dir;

        const windVelocity = document.createElement('p');
        windVelocity.classList.add('city-card__text');
        windVelocity.textContent = `${data.wind.speed}km/h`;

        downCard.append(humidity, windDirection, windVelocity);


        const cityCard = document.createElement('div');
        cityCard.classList.add('city-card');
        cityCard.append(upCard, downCard);

        const cities = document.querySelector('.cities');
        const addCity = document.querySelector('.add');
        cities.insertBefore(cityCard, addCity);
    }
}

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', handleRequestBta);
xhr.open('GET', `${API_URL}bogota`, true);
xhr.send();

const xhrSecond = new XMLHttpRequest();
xhrSecond.addEventListener('load', handleRequestBtaForecast);
xhrSecond.open('GET', `${API_URL_FORECAST}bogota`, true);
xhrSecond.send();

const xhrParis = new XMLHttpRequest();
xhrParis.addEventListener('load', handleRequestCity);
xhrParis.open('GET', `${API_URL}paris`, true);
xhrParis.send();

const xhrOther = new XMLHttpRequest();
xhrOther.addEventListener('load', handleRequestCity);
xhrOther.open('GET', `${API_URL}madrid`, true);
xhrOther.send();
