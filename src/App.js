
import React, { useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const App = () => {
  const [city, setCity] = useState('');
  const [weeklyData, setWeeklyData] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'YOUR_API_KEY';

  const getWeather = async () => {
    if (!city) return;

    try {
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      const { lat, lon } = geoRes.data[0];

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`
      );

      setWeeklyData(weatherRes.data.daily.slice(0, 7));
      setError('');
    } catch (err) {
      setError('City not found or API error');
      setWeeklyData(null);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ textAlign: 'center', marginTop: 30 }}>
      <h1>Weekly Weather Dashboard</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weekly Data</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weeklyData && (
        <div style={{ width: '90%', margin: 'auto', marginTop: 30 }}>
          <h2>Temperature (°C)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData.map((day, i) => ({
              day: `Day ${i + 1}`,
              temp: day.temp.day
            }))}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          <h2>Rainfall (mm)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData.map((day, i) => ({
              day: `Day ${i + 1}`,
              rain: day.rain || 0
            }))}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rain" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>

          <h2>Humidity (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={weeklyData.map((day, i) => ({
                  name: `Day ${i + 1}`,
                  value: day.humidity
                }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {weeklyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default App;
