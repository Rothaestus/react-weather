import React from 'react';

const APIContextValue = {
  weatherAPIKey: 'a15f76d72024e82928b3443c726d7e17',
  mapboxAPIKey:
    'pk.eyJ1IjoiZGFucGUiLCJhIjoiY2t6bXU4M3MwMnM3bzJvb2N3YnZpdHFkNiJ9.pumYaHbnfCKFH3Hdm0Rh0w',
};

export const APIContext = React.createContext(APIContextValue);

const APIContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <APIContext.Provider value={APIContextValue}>
      {props.children}
    </APIContext.Provider>
  );
};

export default APIContextProvider;
