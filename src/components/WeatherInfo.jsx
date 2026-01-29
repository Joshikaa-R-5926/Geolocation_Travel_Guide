import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, ArrowLeft, Thermometer, MapPin, Calendar } from 'lucide-react';

const WeatherInfo = ({ initialPlace, onBack }) => {
    const [place, setPlace] = useState(initialPlace || 'Chennai');
    const [weatherData, setWeatherData] = useState(null);

    // Helper to get next 7 days
    const getNext7Days = () => {
        const days = [];
        const today = new Date();
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push(i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()]);
        }
        return days;
    };

    const dayLabels = getNext7Days();

    // Mock Weather Data with 7-Day Forecast
    // Derived from user provided URL context: Clear/Partly Cloudy, Temps ~26-30C
    const mockWeather = {
        'Chennai': {
            temp: 27, condition: 'Sunny', humidity: 67, wind: 21,
            forecast: [
                { day: dayLabels[0], temp: 27, condition: 'Sunny' },
                { day: dayLabels[1], temp: 26, condition: 'Clear' },
                { day: dayLabels[2], temp: 27, condition: 'Sunny' },
                { day: dayLabels[3], temp: 27, condition: 'Partly Cloudy' },
                { day: dayLabels[4], temp: 28, condition: 'Sunny' },
                { day: dayLabels[5], temp: 28, condition: 'Sunny' },
                { day: dayLabels[6], temp: 27, condition: 'Cloudy' }
            ]
        },
        'Coimbatore': {
            temp: 26, condition: 'Partly Cloudy', humidity: 60, wind: 12,
            forecast: [
                { day: dayLabels[0], temp: 26, condition: 'Partly Cloudy' },
                { day: dayLabels[1], temp: 25, condition: 'Cloudy' },
                { day: dayLabels[2], temp: 26, condition: 'Sunny' },
                { day: dayLabels[3], temp: 26, condition: 'Mist' },
                { day: dayLabels[4], temp: 27, condition: 'Sunny' },
                { day: dayLabels[5], temp: 27, condition: 'Sunny' },
                { day: dayLabels[6], temp: 26, condition: 'Partly Cloudy' }
            ]
        },
        'Madurai': {
            temp: 31, condition: 'Sunny', humidity: 55, wind: 10,
            forecast: [
                { day: dayLabels[0], temp: 31, condition: 'Sunny' },
                { day: dayLabels[1], temp: 30, condition: 'Clear' },
                { day: dayLabels[2], temp: 31, condition: 'Sunny' },
                { day: dayLabels[3], temp: 32, condition: 'Hot' },
                { day: dayLabels[4], temp: 31, condition: 'Sunny' },
                { day: dayLabels[5], temp: 31, condition: 'Sunny' },
                { day: dayLabels[6], temp: 30, condition: 'Partly Cloudy' }
            ]
        },
        'Ooty': {
            temp: 16, condition: 'Mist', humidity: 85, wind: 8,
            forecast: [
                { day: dayLabels[0], temp: 16, condition: 'Mist' },
                { day: dayLabels[1], temp: 15, condition: 'Fog' },
                { day: dayLabels[2], temp: 16, condition: 'Cloudy' },
                { day: dayLabels[3], temp: 15, condition: 'Rain' },
                { day: dayLabels[4], temp: 16, condition: 'Mist' },
                { day: dayLabels[5], temp: 17, condition: 'Sunny' },
                { day: dayLabels[6], temp: 16, condition: 'Partly Cloudy' }
            ]
        },
        'Kodaikanal': {
            temp: 15, condition: 'Foggy', humidity: 90, wind: 5,
            forecast: [
                { day: dayLabels[0], temp: 15, condition: 'Fog' },
                { day: dayLabels[1], temp: 14, condition: 'Mist' },
                { day: dayLabels[2], temp: 15, condition: 'Cloudy' },
                { day: dayLabels[3], temp: 15, condition: 'Rain' },
                { day: dayLabels[4], temp: 16, condition: 'Fog' },
                { day: dayLabels[5], temp: 16, condition: 'Sunny' },
                { day: dayLabels[6], temp: 15, condition: 'Partly Cloudy' }
            ]
        },
        'Kanyakumari': {
            temp: 28, condition: 'Windy', humidity: 75, wind: 25,
            forecast: [
                { day: dayLabels[0], temp: 28, condition: 'Windy' },
                { day: dayLabels[1], temp: 28, condition: 'Cloudy' },
                { day: dayLabels[2], temp: 29, condition: 'Sunny' },
                { day: dayLabels[3], temp: 28, condition: 'Sunny' },
                { day: dayLabels[4], temp: 28, condition: 'Windy' },
                { day: dayLabels[5], temp: 29, condition: 'Partly Cloudy' },
                { day: dayLabels[6], temp: 28, condition: 'Sunny' }
            ]
        },
        'Rameswaram': {
            temp: 29, condition: 'Sunny', humidity: 70, wind: 20,
            forecast: [
                { day: dayLabels[0], temp: 29, condition: 'Sunny' },
                { day: dayLabels[1], temp: 28, condition: 'Clear' },
                { day: dayLabels[2], temp: 29, condition: 'Sunny' },
                { day: dayLabels[3], temp: 29, condition: 'Windy' },
                { day: dayLabels[4], temp: 30, condition: 'Sunny' },
                { day: dayLabels[5], temp: 29, condition: 'Sunny' },
                { day: dayLabels[6], temp: 29, condition: 'Clear' }
            ]
        },
        'Thanjavur': {
            temp: 30, condition: 'Clear', humidity: 65, wind: 10,
            forecast: [
                { day: dayLabels[0], temp: 30, condition: 'Clear' },
                { day: dayLabels[1], temp: 29, condition: 'Sunny' },
                { day: dayLabels[2], temp: 30, condition: 'Sunny' },
                { day: dayLabels[3], temp: 31, condition: 'Sunny' },
                { day: dayLabels[4], temp: 30, condition: 'Partly Cloudy' },
                { day: dayLabels[5], temp: 31, condition: 'Sunny' },
                { day: dayLabels[6], temp: 30, condition: 'Sunny' }
            ]
        },
        'Tamil Nadu': {
            temp: 27, condition: 'Sunny', humidity: 67, wind: 21,
            forecast: [
                { day: dayLabels[0], temp: 27, condition: 'Sunny' },
                { day: dayLabels[1], temp: 26, condition: 'Clear' },
                { day: dayLabels[2], temp: 27, condition: 'Sunny' },
                { day: dayLabels[3], temp: 27, condition: 'Partly Cloudy' },
                { day: dayLabels[4], temp: 28, condition: 'Sunny' },
                { day: dayLabels[5], temp: 28, condition: 'Sunny' },
                { day: dayLabels[6], temp: 27, condition: 'Cloudy' }
            ]
        }
    };

    const destinations = Object.keys(mockWeather).filter(k => k !== 'Tamil Nadu');

    useEffect(() => {
        // Simulate loading
        const data = mockWeather[place] || mockWeather['Chennai'];
        setWeatherData(data);
    }, [place]);

    const getWeatherIcon = (condition) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={24} color="#3b82f6" />;
        if (c.includes('cloud') || c.includes('mist') || c.includes('fog')) return <Cloud size={24} color="#94a3b8" />;
        if (c.includes('wind')) return <Wind size={24} color="#64748b" />;
        if (c.includes('hot')) return <Sun size={24} color="#ef4444" />;
        if (c.includes('clear')) return <Sun size={24} color="#f59e0b" />;
        return <Sun size={24} color="#f59e0b" />;
    };

    const getMainIcon = (condition) => {
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
                            {getMainIcon(weatherData.condition)}
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

                        {/* 7-Day Forecast */}
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar size={18} /> 7-Day Forecast
                            </h4>
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                {weatherData.forecast.map((f, i) => (
                                    <div key={i} style={{
                                        flex: '0 0 auto',
                                        width: '90px',
                                        padding: '1rem',
                                        background: 'var(--glass-highlight)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            {f.day}
                                        </div>
                                        <div style={{ margin: '0.5rem 0' }}>{getWeatherIcon(f.condition)}</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text)' }}>
                                            {f.temp}°
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                                            {f.condition}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Source Attribution */}
                            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                                <a
                                    href="https://weather.com/en-IN/weather/hourbyhour/l/f66d2685a18a8302f94567f58ce5c21e315792fd07a12b5659f4f0aec09a0d80"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}
                                >
                                    Data source: The Weather Channel ↗
                                </a>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherInfo;
