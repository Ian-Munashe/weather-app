import axios from "axios";
import { apiKey } from "src/constants/constants";

const forecastEndpoint = (params: any) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const locationsEndpoint = (params: any) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint: string) => {
  const options = { method: "GET", url: endpoint, timeout: 30000 };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
};

export const fetchWeatherForecast = (params: any) =>
  apiCall(forecastEndpoint(params));

export const fetchLocations = (params: any) =>
  apiCall(locationsEndpoint(params));
