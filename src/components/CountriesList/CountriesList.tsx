import React, { useCallback, useContext, useEffect, useState } from 'react';

import './CountriesList.css';

import { fetchCountries, fetchLngLat } from '../../functions/fetchCountries';
import { APIContext } from '../../context/api-context';
import { MapContext } from '../../context/map-context';

const CountriesList: React.FC<{
  locationSwitchHandler: (
    countryCode: string,
    countryName: string,
    countryLng: number,
    countryLat: number
  ) => void;
}> = (props) => {
  const [data, setData] =
    useState<{ name: string; code: string; lngLat: [number, number] }[]>();

  const api_ctx = useContext(APIContext);
  const mapboxAPIKey = api_ctx.mapboxAPIKey;

  const map_ctx = useContext(MapContext);
  const { defaultCode, defaultName, defaultLocation } = map_ctx;

  const fetchDataNew = useCallback(async () => {
    const countries: { name: string; code: string }[] = await fetchCountries();
    let countriesWithCoordinates = [];

    for (let country of countries) {
      const getCoordinates = async (country: {
        name: string;
        code: string;
      }) => {
        let lngLat = await fetchLngLat(mapboxAPIKey, country);

        return { ...country, lngLat };
      };

      countriesWithCoordinates.push(getCoordinates(country));
    }

    Promise.all(countriesWithCoordinates).then((values) => {
      setData(values);
    });
  }, [mapboxAPIKey]);

  const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const element = target.closest('.CountriesList__item') as HTMLElement;
    const elementLabel = element.querySelector(
      '.CountriesList__name'
    ) as HTMLElement;

    const { countryCode, countryLng, countryLat } = element.dataset;
    const countryName = elementLabel.textContent || '';

    if (countryName === '') {
      props.locationSwitchHandler(
        defaultCode,
        defaultName,
        defaultLocation.lng,
        defaultLocation.lat
      );
    } else {
      if (countryCode && countryLng && countryLat) {
        const location = {
          countryCode,
          countryName,
          countryLng: +countryLng,
          countryLat: +countryLat,
        };

        props.locationSwitchHandler(
          location.countryCode,
          location.countryName,
          location.countryLng,
          location.countryLat
        );

        localStorage.setItem('LastSelected', JSON.stringify(location));
      }
    }
  };

  useEffect(() => {
    fetchDataNew();
  }, [fetchDataNew]);

  return (
    <div className="Countries">
      <ul className="CountriesList">
        {data &&
          data.map((item, index) => {
            return (
              <li
                key={index}
                className="CountriesList__item"
                data-country-code={item.code}
                data-country-lng={item.lngLat[0]}
                data-country-lat={item.lngLat[1]}
                onClick={onClickHandler}
              >
                <span className="CountriesList__coordinates">
                  Lng: {item.lngLat[0].toPrecision(4)}
                </span>
                <br />
                <span className="CountriesList__coordinates">
                  Lat: {item.lngLat[1].toPrecision(4)}
                </span>
                <br />
                <span className="CountriesList__name">{item.name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default CountriesList;
