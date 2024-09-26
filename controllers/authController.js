var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BeeperStatus } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';
import { writeUserToJsonFile, readFromJsonFile, UpdateFile, updateUser } from "../DAL/jsonUser.js";
import { IsLocationNormal } from "../service/service.js";
export const CreateBeeper = (req, res) => {
    try {
        const beeper = req.body;
        beeper.id = uuidv4();
        beeper.status = BeeperStatus.manufactured;
        beeper.created_at = new Date();
        beeper.detonated_at = null;
        beeper.latitude = 0;
        beeper.longitude = 0;
        writeUserToJsonFile(beeper);
        res.send(beeper);
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
};
export const GetAllBeepers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readFromJsonFile();
        res.status(200).send(beepers);
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
});
export const GetBeeperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readFromJsonFile();
        const beeperFind = beepers.find((u) => u.id == req.params.id);
        if (beeperFind) {
            res.status(200).send(beeperFind);
        }
        else {
            throw new Error("beeper not found");
        }
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
});
export const GetBeeperByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readFromJsonFile();
        const beeperFind = beepers.filter((u) => u.status == req.params.status);
        if (beeperFind) {
            res.status(200).send(beeperFind);
        }
        else {
            throw new Error(`There is no beeper with this status ${req.params.status}`);
        }
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
});
export const deleteBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readFromJsonFile();
        const beeperIndex = beepers.findIndex((u) => u.id == req.body.id);
        if (!beeperIndex) {
            throw new Error("beeper not found");
        }
        beepers.splice(beeperIndex, 1);
        UpdateFile(beepers);
        res.status(200).send({ message: "beeper deleted" });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
});
export const UpdateStatusBeeper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield readFromJsonFile();
        const beeperFind = beepers.find((u) => u.id == req.params.id);
        if (!beeperFind) {
            throw new Error("beeper not found");
        }
        switch (beeperFind.status) {
            case BeeperStatus.manufactured:
                beeperFind.status = BeeperStatus.assembled;
                break;
            case BeeperStatus.assembled:
                beeperFind.status = BeeperStatus.shipped;
                break;
            case BeeperStatus.shipped:
                beeperFind.status = BeeperStatus.deployed;
                // מקבל מיקום מקומי ומפעיל טיימר של 10 שניות ומשנה את הסטטוס ל התפוצץ
                if (!IsLocationNormal(req.body.latitude, req.body.longitude)) {
                    throw new Error("Improper location");
                }
                else {
                    beeperFind.latitude = req.body.latitude;
                    beeperFind.longitude = req.body.longitude;
                    updateUser(beeperFind);
                    setTimeout(() => {
                        console.log("ddddddddd");
                        beeperFind.status = BeeperStatus.detonated;
                        beeperFind.detonated_at = new Date();
                        beeperFind.name = "dead";
                        updateUser(beeperFind);
                    }, 10000);
                }
                break;
            default:
                throw new Error("invalid status");
        }
        updateUser(beeperFind);
        res.status(200).send({ message: `status updated ${beeperFind.status}` });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
});
