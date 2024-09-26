import { Request,Response } from "express";
import {Beeper,BeeperStatus} from '../models/types.js';
import {v4 as uuidv4} from 'uuid'
import { writeUserToJsonFile,readFromJsonFile,UpdateFile,updateUser} from "../DAL/jsonUser.js";
import {updateStatusBeeper} from "../service/service.js";

export const CreateBeeper = (req:Request,res:Response)=>{
    try{
    const beeper:Beeper = req.body;
    beeper.id = uuidv4();
    beeper.status = BeeperStatus.manufactured;
    beeper.created_at = new Date();
    beeper.detonated_at = null;
    beeper.latitude = 0;
    beeper.longitude = 0;
    writeUserToJsonFile(beeper)
    res.send( beeper);
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}

export const GetAllBeepers = async (req:Request,res:Response)=>{
    try {
    const beepers: Beeper[] = await readFromJsonFile();
        res.status(200).send(beepers);
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}

export const GetBeeperById = async (req:Request,res:Response)=>{
    try {
    const beepers: Beeper[] = await readFromJsonFile();
    const beeperFind: Beeper | undefined = beepers.find((u) =>u.id == req.params.id );
    if (beeperFind) {
        res.status(200).send(beeperFind);
    }
    else {
        throw new Error("beeper not found")
    }
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}

export const GetBeeperByStatus = async (req:Request,res:Response)=>{
    try {
    const beepers: Beeper[] = await readFromJsonFile();
    const beeperFind: Beeper[] | undefined = beepers.filter((u) =>u.status == req.params.status );
    if (beeperFind) {
        res.status(200).send(beeperFind);
    }
    else {
        throw new Error(`There is no beeper with this status ${req.params.status}`)
    }
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}

export const deleteBeeper = async (req:Request,res:Response)=>{
    try {
    const beepers: Beeper[] = await readFromJsonFile();
    const beeperIndex: number = beepers.findIndex((u) =>u.id == req.body.id );
    if (!beeperIndex) {
        throw new Error("beeper not found")
    }

    beepers.splice(beeperIndex,1)
    await UpdateFile(beepers)
    res.status(200).send({message:"beeper deleted"});
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}

export const UpdateStatusBeeper = async (req:Request,res:Response)=>{
    try {
    const beepers: Beeper[] = await readFromJsonFile();
    const beeperFind: Beeper | undefined = beepers.find((u) =>u.id == req.params.id );
    if (!beeperFind) {
        throw new Error("beeper not found")
    }
    const Beeper:Beeper = await updateStatusBeeper(beeperFind,req.body.lat,req.body.lon);
    res.status(200).send({message:`status updated ${beeperFind.status}`});
    await updateUser(Beeper );
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}


