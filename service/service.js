import { Longitude, Latitude } from '../models/types.js';
export function IsLocationNormal(latitudeBody, longitudeBody) {
    const indexLongitude = Longitude.findIndex((u) => u == longitudeBody);
    const indexLatitude = Latitude.findIndex((u) => u == latitudeBody);
    if (indexLongitude == -1 || indexLatitude == -1) {
        return false;
    }
    return indexLongitude == indexLatitude;
}
