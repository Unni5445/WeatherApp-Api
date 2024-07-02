import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [data, setData] = useState([]);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "8c361c752b104a5d8de94557241806";

  const getWeatherApi = async (city) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
      );
      if (response.data.error) {
        throw new Error(response.data.error.message);
      }
      const data = response.data;
      setData([data]);
      setError(null);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim() !== "") {
      getWeatherApi(city);
      setCity("");
      setError(null);
    } else {
      setError("Please enter a city name.");
    }
  };

  useEffect(() => {
    getWeatherApi("New York");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 m-4 shadow-lg w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
          Weather Data
        </h1>
        <div className="flex flex-col sm:flex-row items-center mb-6 w-full">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow px-4 py-2 text-black rounded-lg border-t border-l border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2 sm:mb-0 sm:mr-2"
            placeholder="Enter city"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md sm:rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader border-t-4 border-blue-600 rounded-full w-16 h-16"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((item, index) => (
              <div key={index} className="p-6 bg-white bg-opacity-20 rounded-md shadow-md">
                <p className="text-2xl font-bold mb-4 text-center text-blue-300">
                  {item.location.name}, {item.location.region}, {item.location.country}
                </p>
                <div className="mt-4 flex flex-col items-center">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-green-300">Temperature:</p>
                    <p className="text-lg text-green-200">Celsius: {item.current.temp_c}°C</p>
                    <p className="text-lg text-green-200">Fahrenheit: {item.current.temp_f}°F</p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xl font-semibold text-yellow-300">Condition:</p>
                    <p className="text-lg text-yellow-200">{item.current.condition.text}</p>
                    <img
                      src={item.current.condition.icon}
                      alt={item.current.condition.text}
                      className="mx-auto"
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xl font-semibold text-purple-300">Humidity:</p>
                    <p className="text-lg text-purple-200">{item.current.humidity}%</p>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xl font-semibold text-red-300">Wind:</p>
                    <p className="text-lg text-red-200">Speed: {item.current.wind_kph} kph</p>
                    <p className="text-lg text-red-200">Direction: {item.current.wind_dir}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
