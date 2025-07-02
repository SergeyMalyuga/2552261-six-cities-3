import {useEffect, useRef} from 'react';
import {Icon, layerGroup, Marker} from 'leaflet';
import useMap from '../../hooks/use-map';
import {City} from '../../types/city.ts';
import {URL_MARKER_CURRENT, URL_MARKER_DEFAULT} from '../../const.ts';
import {Offer, OfferPreview, OffersPreview} from '../../types/offers.ts';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  city: City | undefined;
  points: OffersPreview;
  activeCard: OfferPreview | Offer | undefined;
  className: string;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [27, 39],
  iconAnchor: [20, 40]
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [27, 39],
  iconAnchor: [20, 40]
});

function Map(props: MapProps): JSX.Element {
  const {city, points, activeCard, className} = props;
  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  useEffect(() => {
    if (map && points) {
      const markerLayer = layerGroup().addTo(map);
      points.forEach((point) => {
        const marker = new Marker({
          lat: point.location.latitude,
          lng: point.location.longitude,
        });

        marker
          .setIcon(
            activeCard !== undefined && point.location.latitude === activeCard?.location.latitude && point.location.longitude === activeCard?.location.longitude
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points, activeCard]);

  return <section className={`${className} map`} ref={mapRef}></section>;
}

export default Map;
