import { LocalStorage } from "node-localstorage";
import { getAppRoot } from "utilities/util";
import path from "path";
import { log } from "utilities/log";
import chalk from "chalk";

const appRoot = getAppRoot();
const localStorage = new LocalStorage(path.join(appRoot, ".scratch"));

export function getSessionToken() {
	const token = localStorage.getItem("sessionToken");
	if (!token) {
		log(
			chalk`{bgRed Session token not found! Run npx ts-node login.ts to authenticate to Advent of Code.}`
		);
		process.exit(1);
	}
	return token;
}
