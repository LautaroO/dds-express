import Base64 from "crypto-js/enc-base64";
import sha256 from "crypto-js/sha256";
import { User } from "../entity/User";

export const maxOffsetSize = 50;

export const skip = (offset: number): number => {
    return (offset - 1) * maxOffsetSize;
}

export const getRandomNumber = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}

export const generateToken = (user: User): string => {

    let dataOfToken = `${user.email}${user.generatedId}`;

    return sha256(dataOfToken).toString(Base64);
}