import {Longitude,Latitude} from '../models/types.js';
export function aa(latitudeBody:Number,longitudeBody:Number):boolean
{
    const indexLongitude:number = Longitude.findIndex((u) =>u == longitudeBody );
    const indexLatitude:number = Latitude.findIndex((u) =>u == latitudeBody );
    if (indexLongitude == -1 || indexLatitude == -1) {
        throw new Error("location not found")
    }
    return indexLongitude == indexLatitude;
}