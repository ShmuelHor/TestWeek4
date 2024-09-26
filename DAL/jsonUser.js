var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jsonfile from 'jsonfile';
export const writeUserToJsonFile = (beeper) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beepers = yield jsonfile.readFile('./data/db.json');
        beepers.push(beeper);
        yield jsonfile.writeFile('./data/db.json', beepers);
    }
    catch (error) {
        console.error('Error writing user to JSON file:', error);
    }
});
export const readFromJsonFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield jsonfile.readFile('./data/db.json');
    return users;
});
export const updateUser = (beeper) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield jsonfile.readFile('./data/db.json');
        const index = users.findIndex((u) => u.id === beeper.id);
        if (index !== -1) {
            users[index] = beeper;
            yield jsonfile.writeFile('./data/db.json', users);
        }
    }
    catch (error) {
        console.error('Error updating user in JSON file:', error);
    }
});
export const UpdateFile = (beepers) => __awaiter(void 0, void 0, void 0, function* () {
    yield jsonfile.writeFile('./data/db.json', beepers);
});
