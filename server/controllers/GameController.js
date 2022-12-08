import ErrorService from "../services/ErrorService.js";
import firestore from '../services/firestore.js'
import { getFirestore, collection, getDocs, addDoc,setDoc,  deleteDoc, doc } from 'firebase/firestore/lite';
const db = getFirestore(firestore);

class GameController {
    static fireStorePath = 'games'
    static col = collection(db, GameController.fireStorePath);
    index() {
        return async (req, res) => {
            try {
                const gameSnapshot = await getDocs(GameController.col);
                const games =  gameSnapshot.docs.map(doc => doc.data());
                res.send(games)
            } catch (e) {
                return ErrorService.createError(
                    `Games Controller | index`,
                    ErrorService.errors.generalError,
                    res,
                )
            }
        }
    }

    store() {
        return async (req, res) => {
            try {
                const docRef = await addDoc(GameController.col, {
                    name: req.body.name,
                });
                res.send({id: docRef.id})
            } catch (e) {
                return ErrorService.createError(
                    `Games Controller | index`,
                    ErrorService.errors.generalError,
                    res,
                )
            }
        }
    }

    update() {
        return async (req, res) => {
            try {
                const d = doc(db, GameController.fireStorePath, req.params.id)
                await setDoc(d, req.body)
                res.sendStatus(200)
            } catch (e) {
                return ErrorService.createError(
                    `Games Controller | index`,
                    ErrorService.errors.generalError,
                    res,
                )
            }
        }
    }

    destroy() {
        return async (req, res) => {
            try {
                const d = doc(db, GameController.fireStorePath, req.params.id)
                await deleteDoc(d)
                res.send({id: d.id})
            } catch (e) {
                return ErrorService.createError(
                    `Games Controller | index`,
                    ErrorService.errors.generalError,
                    res,
                )
            }
        }
    }
}

export default GameController
