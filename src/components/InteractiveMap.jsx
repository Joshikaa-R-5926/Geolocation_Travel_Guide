import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '24px'
};

const options = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
};

export const InteractiveMap = ({ center, places, onPlaceClick, apiKey }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    const [map, setMap] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    if (loadError) {
        return <div className="glass" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Error loading maps. Check API Key.</div>
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={options}
        >
            {places.map((place, idx) => (
                place.coordinates ? (
                    <Marker
                        key={idx}
                        position={place.coordinates}
                        title={place.name}
                        onClick={() => {
                            setSelectedPlace(place);
                            if (onPlaceClick) onPlaceClick(place);
                        }}
                    />
                ) : null
            ))}

            {selectedPlace && selectedPlace.coordinates && (
                <InfoWindow
                    position={selectedPlace.coordinates}
                    onCloseClick={() => setSelectedPlace(null)}
                >
                    <div style={{ padding: '8px', color: 'black', maxWidth: '200px' }}>
                        <h4 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{selectedPlace.name}</h4>
                        <div style={{ width: '100%', height: '100px', overflow: 'hidden', borderRadius: '4px', marginBottom: '8px' }}>
                            <img src={selectedPlace.image} alt={selectedPlace.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', margin: '0' }}>{selectedPlace.category}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    ) : <div className="glass" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Interactive Map...</div>;
};
