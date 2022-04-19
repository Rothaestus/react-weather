import React from 'react';

const MapContextValue = {
  defaultLocation: { lng: 19.3, lat: 52.12 },
  defaultName: 'Poland',
  defaultCode: 'PL',
};

export const MapContext = React.createContext(MapContextValue);

const MapContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <MapContext.Provider value={MapContextValue}>
      {props.children}
    </MapContext.Provider>
  );
};

export default MapContextProvider;
