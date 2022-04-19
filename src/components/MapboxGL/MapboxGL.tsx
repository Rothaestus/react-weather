import { useEffect, useCallback, useState, useContext } from 'react';

import './MapboxGL.css';

import mapboxgl, { Marker, Popup } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import fetchWeather, { Weather } from '../../functions/fetchWeather';
import { APIContext } from '../../context/api-context';
import { MapContext } from '../../context/map-context';

const MapboxGL: React.FC<{
  locationCode: string;
  locationName: string;
  locationLng: number;
  locationLat: number;
}> = (props) => {
  const [map, setMap] = useState<mapboxgl.Map>();

  const [mapObjects, setMapObjects] = useState<{
    markers: Marker[];
    popups: Popup[];
  }>({ markers: [], popups: [] });

  // const [mapMarkers, setMapMarkers] = useState<Marker[]>([]);
  // const [mapPopups, setMapPopups] = useState<Popup[]>([]);

  const api_ctx = useContext(APIContext);
  const { mapboxAPIKey, weatherAPIKey } = api_ctx;

  const map_ctx = useContext(MapContext);
  const { defaultCode, defaultLocation, defaultName } = map_ctx;

  const locationCode = props.locationCode;
  const locationName = props.locationName;
  const locationLng = props.locationLng;
  const locationLat = props.locationLat;

  const flyTo = (
    map: mapboxgl.Map,
    locationLng: number,
    locationLat: number
  ) => {
    map.flyTo({
      center: [locationLng, locationLat],
      essential: true,
      zoom: 5,
    });
  };

  const addMarker = (
    map: mapboxgl.Map,
    locationLng: number,
    locationLat: number
  ) => {
    const marker = new mapboxgl.Marker()
      .setLngLat([locationLng, locationLat])
      .addTo(map);
    // setMapMarkers((savedMarkers) => {
    //   return [...savedMarkers, marker];
    // });
    setMapObjects((savedObjects) => {
      return {
        markers: [...savedObjects.markers, marker],
        popups: [...savedObjects.popups],
      };
    });
  };

  const addPopup = (
    map: mapboxgl.Map,
    locationName: string,
    locationLng: number,
    locationLat: number,
    info: Weather
  ) => {
    const popup = new mapboxgl.Popup({
      offset: { bottom: [0, -40] },
      closeButton: false,
      closeOnClick: false,
    })
      .setLngLat([locationLng, locationLat])
      .setHTML(
        `<div class="WeatherInfo">
      <span>Weather for: ${locationName}</span>
      <span>Temp: <strong>${info.temp}°C</strong></span>
      <span>Feels like: <strong>${info.feels_like}°C</strong></span>
      <span>Min: <strong>${info.temp_min}°C</strong></span>
      <span>Max: <strong>${info.temp_max}°C</strong></span>
      <span>Humidity: <strong>${info.humidity}%</strong></span>
      </div>
      `
      )
      .addTo(map);

    // setMapPopups((savedPopups) => {
    //   return [...savedPopups, popup];
    // });

    setMapObjects((savedObjects) => {
      return {
        markers: [...savedObjects.markers],
        popups: [...savedObjects.popups, popup],
      };
    });
  };

  // const clearMap = useCallback(() => {
  //   mapMarkers.forEach((marker) => {
  //     marker.remove();
  //   });

  //   mapPopups.forEach((popup) => {
  //     popup.remove();
  //   });
  // }, [mapMarkers, mapPopups]);

  const clearMap = useCallback(() => {
    mapObjects.markers.forEach((marker) => {
      marker.remove();
    });

    mapObjects.popups.forEach((popup) => {
      popup.remove();
    });
  }, [mapObjects]);

  const renderMap = useCallback(() => {
    mapboxgl.accessToken = mapboxAPIKey;

    const initNewMap = () => {
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [19.3, 52.12], // starting position [lng, lat]
        zoom: 5, // starting zoom
      });
      setMap(map);

      return map;
    };

    const mapbox = map ? map : initNewMap();
    clearMap();

    const lastSelected = localStorage.getItem('LastSelected');

    console.group('Props');
    console.log({
      name: locationName,
      code: locationCode,
      lng: locationLng,
      lat: locationLat,
    });
    console.groupEnd();

    if (lastSelected) {
      const location: {
        countryCode: string;
        countryName: string;
        countryLng: number;
        countryLat: number;
      } = JSON.parse(lastSelected);

      console.group('Saved');
      console.log({
        name: location.countryName,
        code: location.countryCode,
        lng: location.countryLng,
        lat: location.countryLat,
      });
      console.groupEnd();

      const lastSelectedWeather: Promise<Weather> = fetchWeather(
        location.countryCode,
        weatherAPIKey
      );

      lastSelectedWeather.then((weatherValues: Weather) => {
        addPopup(
          mapbox,
          location.countryName,
          location.countryLng,
          location.countryLat,
          weatherValues
        );
        addMarker(mapbox, location.countryLng, location.countryLat);
        flyTo(mapbox, location.countryLng, location.countryLat);
      });
    } else {
      console.group('Default');
      console.log({ defaultName, defaultCode, defaultLocation });
      console.groupEnd();

      const currentWeather: Promise<Weather> = fetchWeather(
        defaultCode,
        weatherAPIKey
      );

      currentWeather.then((weatherValues: Weather) => {
        addPopup(
          mapbox,
          defaultName,
          defaultLocation.lng,
          defaultLocation.lat,
          weatherValues
        );
        addMarker(mapbox, defaultLocation.lng, defaultLocation.lat);
        flyTo(mapbox, defaultLocation.lng, defaultLocation.lat);
      });
    }
  }, [
    clearMap,
    defaultCode,
    defaultLocation,
    defaultName,
    map,
    mapboxAPIKey,
    weatherAPIKey,
    locationCode,
    locationName,
    locationLng,
    locationLat,
  ]);

  useEffect(() => {
    renderMap();
  }, [renderMap]);

  return <div id="map"></div>;
};

export default MapboxGL;
