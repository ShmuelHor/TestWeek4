import {Longitude,Latitude,Beeper,BeeperStatus} from '../models/types.js';
export function IsLocationNormal(latitudeBody:Number,longitudeBody:Number):boolean
{
    const indexLongitude:number = Longitude.findIndex((u) =>u == longitudeBody );
    const indexLatitude:number = Latitude.findIndex((u) =>u == latitudeBody );
    if (indexLongitude == -1 || indexLatitude == -1) {
       return false
    }
    return indexLongitude == indexLatitude;
}
// export



// export function startTimerBeeper(beeperFind:Beeper) {
//     setTimeout(() => {
//         console.log("ddddddddd");
//         beeperFind.status = BeeperStatus.detonated;
//         beeperFind.detonated_at = new Date();
//         beeperFind.name = "dead";
//         return beeperFind;

//     },10000)
// }
