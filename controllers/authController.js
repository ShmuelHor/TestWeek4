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
import { updateStatusBeeper } from "../service/service.js";
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
        yield UpdateFile(beepers);
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
        const Beeper = yield updateStatusBeeper(beeperFind, req.body.latitude, req.body.longitude);
        yield updateUser(Beeper);
        res.status(200).send({ message: `status updated ${beeperFind.status}` });
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
});
