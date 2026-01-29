import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, ArrowLeft, Thermometer, MapPin } from 'lucide-react';

const WeatherInfo = ({ initialPlace, onBack }) => {
    const [place, setPlace] = useState(initialPlace || 'Chennai');
    const [weatherData, setWeatherData] = useState(null);

    // Mock Weather Data
    const mockWeather = {
        'Chennai': { temp: 32, condition: 'Sunny', humidity: 75, wind: 15, forecast: ['Sunny', 'Partly Cloudy', 'Sunny'] },
        'Coimbatore': { temp: 28, condition: 'Partly Cloudy', humidity: 60, wind: 12, forecast: ['Cloudy', 'Rainy', 'Cloudy'] },
        'Madurai': { temp: 34, condition: 'Hot', humidity: 55, wind: 10, forecast: ['Sunny', 'Sunny', 'Sunny'] },
        'Ooty': { temp: 18, condition: 'Mist', humidity: 80, wind: 8, forecast: ['Mist', 'Rain', 'Fog'] },
        'Kodaikanal': { temp: 17, condition: 'Foggy', humidity: 85, wind: 5, forecast: ['Fog', 'Rain', 'Mist'] },
        'Kanyakumari': { temp: 29, condition: 'Windy', humidity: 70, wind: 25, forecast: ['Windy', 'Sunny', 'Windy'] },
        'Rameswaram': { temp: 31, condition: 'Sunny', humidity: 65, wind: 20, forecast: ['Sunny', 'Sunny', 'Partly Cloudy'] },
        'Thanjavur': { temp: 33, condition: 'Clear', humidity: 60, wind: 10, forecast: ['Clear', 'Sunny', 'Sunny'] },
        'Tamil Nadu': { temp: 30, condition: 'Varied', humidity: 70, wind: 15, forecast: ['Sunny', 'Rainy', 'Cloudy'] }
    };

    const destinations = Object.keys(mockWeather).filter(k => k !== 'Tamil Nadu');

    useEffect(() => {
        // Simulate loading
        const data = mockWeather[place] || mockWeather['Chennai'];
        setWeatherData(data);
    }, [place]);

    const getWeatherIcon = (condition) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={64} color="#3b82f6" />;
        if (c.includes('cloud') || c.includes('mist') || c.includes('fog')) return <Cloud size={64} color="#94a3b8" />;
        if (c.includes('wind')) return <Wind size={64} color="#64748b" />;
        return <Sun size={64} color="#f59e0b" />;
    };

    return (
        <div className="weather-info-container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn-secondary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text)' }}>Weather Forecast</h2>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Selector */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <div className="glass" style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <MapPin size={20} color="var(--primary)" />
                        <select
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text)',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {destinations.map(d => <option key={d} value={d} style={{ color: 'black' }}>{d}</option>)}
                        </select>
                    </div>
                </div>

                {/* Create Weather Card */}
                {weatherData && (
                    <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

                        <div style={{ marginBottom: '2rem' }}>
                            {getWeatherIcon(weatherData.condition)}
                            <h1 style={{ fontSize: '5rem', margin: '1rem 0 0', fontWeight: 200, color: 'var(--text)' }}>
                                {weatherData.temp}°<span style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>C</span>
                            </h1>
                            <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 500 }}>{weatherData.condition}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--glass-highlight)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                    <Droplets size={24} color="var(--accent)" />
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Humidity</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weatherData.humidity}%</div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--glass-highlight)', borderRadius: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                    <Wind size={24} color="var(--accent)" />
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Wind</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weatherData.wind} km/h</div>
                            </div>
                        </div>

                        {/* Mini Forecast */}
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>3-Day Forecast</h4>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                                {weatherData.forecast.map((dayCondition, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                                            {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : 'Run Day'}
                                        </div>
                                        <div style={{ transform: 'scale(0.6)' }}>{getWeatherIcon(dayCondition)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherInfo;
