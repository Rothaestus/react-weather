export type Weather = {
  temp: string;
  feels_like: string;
  temp_min: string;
  temp_max: string;
  humidity: string;
}

const fetchWeather = (
  countryCode: string,
  weatherAPIKey: string,
): Promise<Weather> => {
  const API_KEY = weatherAPIKey;

  let data = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=,,${countryCode}&units=metric&appid=${API_KEY}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { temp, feels_like, temp_min, temp_max, humidity } = data.main;
      return { temp, feels_like, temp_min, temp_max, humidity };
    });

  return data;
};

export default fetchWeather;
