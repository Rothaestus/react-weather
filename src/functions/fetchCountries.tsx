export const fetchCountries = async () => {
  const jsonFetchHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let fileData = await fetch('data/countries.json', jsonFetchHeaders)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      return data;
    });

  return fileData;
};

export const fetchLngLat = (mapboxAPIKey: string, country: { name: string; code: string }) => {
  const mapboxglToken = mapboxAPIKey;

  // These codes are no longer valid for ISO 3166-3 - replacement codes temporalily available
  country.code === "AN" && (country.code = "ANHH")
  country.code === "CS" && (country.code = "CSHH")

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${country.name}.json?access_token=${mapboxglToken}`;

  let lngLat = fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data && data.hasOwnProperty('features')) {
        if (data.features[0]) {
          return data.features[0].center
        }
      }
      return null;
    });
  return lngLat;
};