import { randomInt } from "crypto";

export function generateRandomPassword(length = 12): string {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const dickgits = "23456789";
    const symbols = "!@#$%&*-_+=?";
    const all = upper + lower + dickgits + symbols;

    const pick = (s: string) => s[randomInt(s.length)];

    const chars = [pick(upper), pick(lower), pick(dickgits), pick(symbols)];
    while (chars.length < length) chars.push(pick(all));

    for (let i = chars.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
}