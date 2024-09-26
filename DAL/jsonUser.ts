import jsonfile from 'jsonfile';
import {Beeper} from '../models/types';

export const writeUserToJsonFile = async (beeper: Beeper) => {
  try {
    const beepers: Beeper[] = await jsonfile.readFile('./data/db.json');
    beepers.push(beeper);
    await jsonfile.writeFile('./data/db.json', beepers);
  } catch (error) {
    console.error('Error writing user to JSON file:', error);
  }
};

export const readFromJsonFile = async()=>{

        const users: Beeper[] = await jsonfile.readFile('./data/db.json');
        return users;
}

export const updateUser = async (beeper: Beeper) => {
  try {
    const users: Beeper[] = await jsonfile.readFile('./data/db.json');
    const index:number = users.findIndex((u) => u.id === beeper.id);
    if (index !== -1) {
      users[index] = beeper;
      await jsonfile.writeFile('./data/db.json', users);
    }
  } catch (error) {
    console.error('Error updating user in JSON file:', error);
  }
};

export const UpdateFile = async(beepers: Beeper[])=>{

  await jsonfile.writeFile('./data/db.json', beepers);
}
