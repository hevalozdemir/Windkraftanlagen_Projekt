import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';

function ClusterMarkers({ coordinationss }: { coordinationss: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
      // Leaflet.markercluster'ı haritaya ekleyin
      var markers = L.markerClusterGroup();

      coordinationss.forEach((latLon, idx) => {
        const marker = L.marker(latLon);
        marker.bindPopup(`Windkraftanlage ${idx + 1}`);
        markers.addLayer(marker);
      });

      map.addLayer(markers);

      // Temizlik.
      return () => {
        map.removeLayer(markers);
      };
    
  }, [map, coordinationss]);

  return null;
}

function NurKarteProbe() {
  const coordinationss: [number, number][] = [
    [53.846950015463605, 15.542700995766516], // Örnek koordinat 1
    [52.520008, 13.404954] // Örnek koordinat 2 (Berlin)
  ];

  return (
    <MapContainer className='container'
      center={[53.846950015463605, 15.542700995766516]} 
      zoom={6} 
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ClusterMarkers coordinationss={coordinationss} />
    </MapContainer>
  );
}

export default NurKarteProbe;
