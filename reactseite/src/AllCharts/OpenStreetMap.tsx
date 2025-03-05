import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';


// Kümelestirmek icin kendimiz bir fonksiyon tanimlamaliyiz!
function ClusterMarkers({ coordinates }: { coordinates: { breite: number; laenge: number, hersteller: string, leistung: number }[] }) {
  const map = useMap();
  const wkaIcon = L.icon({ iconUrl: 'https://cdn1.iconfinder.com/data/icons/mixed-long-shadow-4/512/wind_turbine-512.png', iconSize: [32, 32] })


  useEffect(() => {
    // Bu kisim zaten bana kaynak olarak verilen gitHubda vardi. 
    //yani kullanilan kalip gibi düsünebiliriz. 
    var markers = L.markerClusterGroup();

    coordinates.forEach((coordinate, idx) => {
      const marker = L.marker([coordinate.breite, coordinate.laenge], { icon: wkaIcon });
      marker.bindPopup(`<strong/><em/>Information WKA-${idx + 1}:</em></strong> <br/> 
                        <strong/>Breite :</strong> ${coordinate.breite}, <br/> 
                        <strong/>Laenge :</strong> ${coordinate.laenge},<br/> 
                        <strong/>Hersteller : </strong>${coordinate.hersteller},<br/> 
                        <strong/>Leistung :</strong> ${coordinate.leistung} kW`);
      //popup: Marker'a(isaretleyiciye) tikladigimizda acilan kücük bilgi penceresi.
      markers.addLayer(marker); //Markerlari otomatik olarak gruplandirmayi saglar.
    });

    map.addLayer(markers); //Gruplandirilmis makerlari haritaya eklemek-haritada göstermek!

    return () => {
      map.removeLayer(markers); // Temizlemek! Bileşen haritadan kaldırıldığında veya güncellendiğinde, eski marker'ları ve küme grubunu (cluster group) haritadan temizlemek için kullanılır.
    };
  }, [map, coordinates]);

  return null;
}

const OpenStreetMap: React.FC = () => {
  const [coordinates, setCoordinates] = useState<{ breite: number; laenge: number, hersteller: string, leistung: number }[]>([]);

  useEffect(() => {
    // Fetch coordinates from the API
    fetch('http://localhost:8090/api/coordinates')
      .then(response => response.json())
      .then(data => setCoordinates(data))
      .catch(error => console.error('Error fetching coordinates:', error));
  }, []);

  return (
    <MapContainer center={[53.846950015463605, 15.542700995766516]} zoom={9} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Yani yukarida tanimladigimiz fonksiyonu burada kaullaniyoruz. */}
      <ClusterMarkers coordinates={coordinates} />
    </MapContainer>
  );
}

export default OpenStreetMap;
