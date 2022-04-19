import './CSSReset/normalize.css';
import './CSSReset/reset.css';
import './App.css';

import { useContext, useState } from 'react';

import CountriesList from './components/CountriesList/CountriesList';
import MapboxGL from './components/MapboxGL/MapboxGL';
import APIContextProvider from './context/api-context';
import MapContextProvider, { MapContext } from './context/map-context';

const App = () => {
  const ctx = useContext(MapContext);
  const { defaultCode, defaultName, defaultLocation } = ctx;

  const [locationCode, setLocationCode] = useState<string>(defaultCode);
  const [locationName, setLocationName] = useState<string>(defaultName);
  const [locationLng, setLocationLng] = useState<number>(defaultLocation.lng);
  const [locationLat, setLocationLat] = useState<number>(defaultLocation.lat);

  const locationSwitchHandler = (
    countryCode: string,
    countryName: string,
    countryLng: number,
    countryLat: number
  ) => {
    console.group('locationSwitchHandler');
    console.log({ countryName, countryCode, countryLng, countryLat });
    console.groupEnd();
  
    setLocationCode(countryCode);
    setLocationName(countryName);
    setLocationLng(countryLng);
    setLocationLat(countryLat);
  };

  return (
    <div className="App">
      <APIContextProvider>
        <CountriesList
          locationSwitchHandler={locationSwitchHandler}
        ></CountriesList>
        <MapContextProvider>
          <MapboxGL
            locationCode={locationCode}
            locationName={locationName}
            locationLng={locationLng}
            locationLat={locationLat}
          ></MapboxGL>
        </MapContextProvider>
      </APIContextProvider>
    </div>
  );
};

export default App;
