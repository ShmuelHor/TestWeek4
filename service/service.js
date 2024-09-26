var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Longitude, Latitude, BeeperStatus } from '../models/types.js';
import { updateUser } from "../DAL/jsonUser.js";
export function IsLocationNormal(latitudeBody, longitudeBody) {
    const indexLongitude = Longitude.findIndex((u) => u == longitudeBody);
    const indexLatitude = Latitude.findIndex((u) => u == latitudeBody);
    if (indexLongitude == -1 && indexLatitude == -1) {
        return false;
    }
    return indexLongitude == indexLatitude;
}
export function updateStatusBeeper(beeperFind, latitudeBody, longitudeBody) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (beeperFind.status) {
            case BeeperStatus.manufactured:
                beeperFind.status = BeeperStatus.assembled;
                return beeperFind;
            case BeeperStatus.assembled:
                beeperFind.status = BeeperStatus.shipped;
                return beeperFind;
            case BeeperStatus.shipped:
                beeperFind.status = BeeperStatus.deployed;
                if (!IsLocationNormal(latitudeBody, longitudeBody)) {
                    throw new Error("Improper location");
                }
                else {
                    beeperFind.latitude = latitudeBody;
                    beeperFind.longitude = longitudeBody;
                    updateUser(beeperFind);
                    const beeper = yield startTimerBeeper(beeperFind);
                    return beeper;
                }
            default:
                throw new Error("invalid status");
        }
    });
}
export function startTimerBeeper(beeperFind) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(() => {
            beeperFind.status = BeeperStatus.detonated;
            beeperFind.detonated_at = new Date();
            beeperFind.name = "dead";
            resolve();
        }, 10000));
        return beeperFind;
    });
}
