import { Longitude, Latitude } from '../models/types.js';
export function aa(latitudeBody, longitudeBody) {
    const indexLongitude = Longitude.findIndex((u) => u == longitudeBody);
    const indexLatitude = Latitude.findIndex((u) => u == latitudeBody);
    if (indexLongitude == -1 || indexLatitude == -1) {
        throw new Error("location not found");
    }
    return indexLongitude == indexLatitude;
}
