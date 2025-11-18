import React, { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/continents/south-america.json';

const markers = [
  { name: 'Buenos Aires', coordinates: [-58.3816, -34.6037] },
  { name: 'La Paz', coordinates: [-68.1193, -16.4897] },
  { name: 'Brasilia', coordinates: [-47.8825, -15.7942] },
  { name: 'Santiago', coordinates: [-70.6693, -33.4489] },
  { name: 'Bogota', coordinates: [-74.0721, 4.711] },
  { name: 'Quito', coordinates: [-78.4678, -0.1807] },
  { name: 'Georgetown', coordinates: [-58.1551, 6.8013] },
  { name: 'Asuncion', coordinates: [-57.5759, -25.2637] },
  { name: 'Paramaribo', coordinates: [-55.2038, 5.852] },
  { name: 'Montevideo', coordinates: [-56.1645, -34.9011] },
  { name: 'Caracas', coordinates: [-66.9036, 10.4806] },
  { name: 'Lima', coordinates: [-77.0428, -12.0464] },
];

const MapChart = ({ customMarkers = markers }) => {
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const handleMouseEnter = (name: any) => setHoveredMarker(name);
  const handleMouseLeave = () => setHoveredMarker(null);

  const mapElements = useMemo(
    () => (
      <>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill='#EAEAEC'
                stroke='#D6D6DA'
                style={{
                  default: { outline: 'none' },
                  hover: { fill: '#F53', outline: 'none' },
                  pressed: { fill: '#E42', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {customMarkers.map(({ name, coordinates }) => (
          <Marker
            key={name}
            coordinates={coordinates as any}
            onMouseEnter={() => handleMouseEnter(name)}
            onMouseLeave={handleMouseLeave}
          >
            <circle
              r={6}
              fill={hoveredMarker === name ? '#FF5533' : '#F00'}
              stroke='#fff'
              strokeWidth={2}
            />
            <text
              textAnchor='middle'
              y={-10}
              style={{
                fontFamily: 'system-ui',
                fill: '#5D5A6D',
                fontSize: 18,
                visibility: hoveredMarker === name ? 'visible' : 'hidden',
              }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </>
    ),
    [customMarkers, hoveredMarker]
  );

  return (
    <ComposableMap
      projection='geoAzimuthalEqualArea'
      projectionConfig={{ rotate: [58, 20, 0], scale: 600 }}
    >
      {mapElements}
    </ComposableMap>
  );
};

export default MapChart;
