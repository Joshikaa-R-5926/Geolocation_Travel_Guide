import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, reviewCount, showCount = true, size = 16 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const getRatingBadge = (rating) => {
        if (rating >= 4.5) return { text: 'Excellent', color: '#10b981' };
        if (rating >= 4.0) return { text: 'Very Good', color: '#14b8a6' };
        if (rating >= 3.5) return { text: 'Good', color: '#3b82f6' };
        if (rating >= 3.0) return { text: 'Average', color: '#f59e0b' };
        return { text: 'Fair', color: '#ef4444' };
    };

    const badge = getRatingBadge(rating);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} size={size} fill="var(--primary)" color="var(--primary)" />
                ))}
                {hasHalfStar && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Star size={size} color="var(--primary)" fill="none" />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
                            <Star size={size} fill="var(--primary)" color="var(--primary)" />
                        </div>
                    </div>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} size={size} color="rgba(255,255,255,0.3)" fill="none" />
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                    {rating.toFixed(1)}
                </span>

                <span
                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        background: `${badge.color}20`,
                        color: badge.color,
                        border: `1px solid ${badge.color}40`
                    }}
                >
                    {badge.text}
                </span>
            </div>

            {showCount && reviewCount && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    ({reviewCount.toLocaleString()} reviews)
                </span>
            )}
        </div>
    );
};
