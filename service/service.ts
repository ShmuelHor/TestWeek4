import {Longitude,Latitude,Beeper,BeeperStatus} from '../models/types.js';
import {updateUser} from "../DAL/jsonUser.js";
import { resolve } from 'path';

export function IsLocationNormal(latitudeBody:Number,longitudeBody:Number):boolean
{
    const indexLongitude:number = Longitude.findIndex((u) =>u == longitudeBody );
    const indexLatitude:number = Latitude.findIndex((u) =>u == latitudeBody );
    if (indexLongitude == -1 && indexLatitude == -1) {
       return false
    }
    return indexLongitude == indexLatitude;
}
export async function updateStatusBeeper(beeperFind:Beeper,latitudeBody:Number,longitudeBody:Number):Promise<Beeper> {
    switch (beeperFind.status) {

        case BeeperStatus.manufactured:
            beeperFind.status = BeeperStatus.assembled;
            return beeperFind;

        case BeeperStatus.assembled:
            beeperFind.status = BeeperStatus.shipped;
            return beeperFind;

        case BeeperStatus.shipped:
            beeperFind.status = BeeperStatus.deployed;

            if(!IsLocationNormal(latitudeBody,longitudeBody)){
                throw new Error("Improper location");
            }
            else{
                beeperFind.latitude = latitudeBody;
                beeperFind.longitude = longitudeBody;
                updateUser(beeperFind);
              const beeper:Beeper = await startTimerBeeper(beeperFind);
              return beeper;
              
            }
            default:
                throw new Error("invalid status");
            }
}

export async function startTimerBeeper(beeperFind:Beeper):Promise<Beeper> {
   await new Promise<void> ((resolve) => setTimeout(() => {
        beeperFind.status = BeeperStatus.detonated;
        beeperFind.detonated_at = new Date();
        beeperFind.name = "dead";
        resolve()
    },10000));
    return beeperFind;
}
