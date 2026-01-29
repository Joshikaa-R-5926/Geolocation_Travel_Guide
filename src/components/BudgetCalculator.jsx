import React, { useState, useMemo } from 'react';
import { Users, Calendar, Calculator, ArrowLeft, PieChart } from 'lucide-react';

const BudgetCalculator = ({ initialDestination, initialDays, onBack }) => {
    const [destination, setDestination] = useState(initialDestination || 'Chennai');
    const [days, setDays] = useState(initialDays || 3);
    const [travelers, setTravelers] = useState(1);
    const [style, setStyle] = useState('Moderate');

    // Mock cost data per day per person (in INR)
    const costData = {
        'Budget Friendly': { accommodation: 800, food: 500, transport: 300, activities: 200 },
        'Moderate': { accommodation: 2500, food: 1200, transport: 800, activities: 1000 },
        'Luxury': { accommodation: 7000, food: 3000, transport: 2500, activities: 3000 },
    };

    const destinations = ['Chennai', 'Coimbatore', 'Madurai', 'Ooty', 'Kodaikanal', 'Kanyakumari', 'Rameswaram', 'Thanjavur'];

    const breakdown = useMemo(() => {
        const costs = costData[style];
        const totalAccommodation = costs.accommodation * days * travelers;
        const totalFood = costs.food * days * travelers;
        const totalTransport = costs.transport * days * travelers;
        const totalActivities = costs.activities * days * travelers;
        const total = totalAccommodation + totalFood + totalTransport + totalActivities;

        return {
            accommodation: totalAccommodation,
            food: totalFood,
            transport: totalTransport,
            activities: totalActivities,
            total: total
        };
    }, [days, travelers, style]);

    return (
        <div className="budget-calculator-container" style={{ padding: '2rem 0' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn-secondary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text)' }}>Budget Estimator</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Controls */}
                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calculator size={24} color="var(--primary)" /> Trip Details
                    </h3>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Destination</label>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--glass-highlight)', color: 'var(--text)', border: '1px solid var(--glass-border)' }}
                        >
                            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Duration (Days)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={20} color="var(--accent)" />
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={days}
                                onChange={(e) => setDays(parseInt(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <span style={{ minWidth: '30px', fontWeight: 'bold', color: 'var(--text)' }}>{days}</span>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Travelers</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={20} color="var(--accent)" />
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={travelers}
                                onChange={(e) => setTravelers(parseInt(e.target.value))}
                                style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', background: 'var(--glass-highlight)', color: 'var(--text)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Travel Style</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['Budget Friendly', 'Moderate', 'Luxury'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStyle(s)}
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem',
                                        fontSize: '0.8rem',
                                        borderRadius: '8px',
                                        border: style === s ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                                        background: style === s ? 'rgba(249, 115, 22, 0.2)' : 'var(--glass-highlight)',
                                        color: style === s ? 'var(--primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {s.replace(' Friendly', '')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: '2rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PieChart size={24} color="var(--success)" /> Estimated Cost
                    </h3>

                    {breakdown && (
                        <div className="breakdown-container">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Accommodation', val: breakdown.accommodation, color: '#f59e0b' },
                                    { label: 'Food & Dining', val: breakdown.food, color: '#10b981' },
                                    { label: 'Transport', val: breakdown.transport, color: '#3b82f6' },
                                    { label: 'Activities', val: breakdown.activities, color: '#ec4899' }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ padding: '1rem', background: 'var(--glass-highlight)', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{item.label}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: item.color }}>₹{item.val.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: '1.5rem', background: 'var(--success)', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Estimated Cost</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>For {travelers} person{travelers > 1 ? 's' : ''}, {days} days</div>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 800 }}>₹{breakdown.total.toLocaleString()}</div>
                            </div>

                            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                                *Estimates are approximate and subject to seasonal variations.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetCalculator;
