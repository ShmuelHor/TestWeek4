import { Request,Response } from "express";
import {Beeper,BeeperStatus} from '../models/types.js';
import {v4 as uuidv4} from 'uuid'
import { writeUserToJsonFile,readFromJsonFile,UpdateFile,updateUser} from "../DAL/jsonUser.js";
import {IsLocationNormal} from "../service/service.js";
import axios from 'axios';
import { promises } from "dns";

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
    UpdateFile(beepers)
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
            if(!IsLocationNormal(req.body.latitude,req.body.longitude)){
                throw new Error("Improper location");
            }
            else{
                beeperFind.latitude = req.body.latitude;
                beeperFind.longitude = req.body.longitude;
                updateUser(beeperFind);
                // 10 שניות
               setTimeout(() => {
                    console.log("ddddddddd");
                    beeperFind.status = BeeperStatus.detonated;
                    beeperFind.detonated_at = new Date();
                    beeperFind.name = "dead";
                    updateUser(beeperFind);

                },10000)
            }
            break;
            default:
                throw new Error("invalid status");
            }
    updateUser(beeperFind);
    res.status(200).send({message:`status updated ${beeperFind.status}`});
    }
    catch(e: any) {
        res.status(500).send({ message: e.message });
    }
}


