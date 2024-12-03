/* Add useful utility functions here */
import { ROOT_DIR, START_YEAR } from "../index";
import { existsSync, readFileSync } from "fs";
import { LocalStorage } from "node-localstorage";
import { Time } from "../types/time";
import path from "path";

const localStorage = new LocalStorage(pathJoin(ROOT_DIR, ".storage"));

export function getLatestPuzzleDate(asOf = new Date()) {
	const asUTC = new Date(asOf.getTime() + asOf.getTimezoneOffset() * 60 * 1000);
	const asEST = new Date(asUTC.getTime() - 5 * 60 * 60 * 1000);
	const isDecember = asEST.getMonth() === 11;
	const currentYear = asEST.getFullYear();
	const latestPuzzleYear = isDecember ? currentYear : currentYear - 1;
	const currentDay = asEST.getDate();
	const latestPuzzleDay = isDecember ? Math.min(currentDay, 25) : 25;
	return { day: latestPuzzleDay, year: latestPuzzleYear };
}

export function getAllYears(): number[] {
	const currentYear = new Date().getFullYear();
	let trackedYear = START_YEAR;
	let allYears: number[] = [];
	while (trackedYear <= currentYear) {
		allYears.push(trackedYear);
		trackedYear += 1;
	}
	return allYears;
}

export function getDayRoot(day: number, year: number) {
	const dayWithLeadingZeros = String(day).padStart(2, "0");
	return pathJoin(ROOT_DIR, String(year), dayWithLeadingZeros);
}

export function getInput(day: number, year: number) {
	const dayRoot = getDayRoot(day, year);
	return readFileSync(pathJoin(dayRoot, "data.txt"), "utf-8");
}

export function pathJoin(...paths: string[]): string {
	return paths.join("/");
}

/**
 * Returns a promise that resolves after a certain amount of time.
 * @param ms Number of milliseconds to wait
 */
export function wait(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatTime(ms: number, precision: number = 3): string {
	const units = msToTime(ms);
	const entries = Object.entries(units);
	let result: string[] = [];
	// find largest unit of time that is not 0
	const startIndex = entries.findIndex(e => e[1] !== 0);
	for (let i = startIndex; i < entries.length; i++) {
		if (entries[i][0] === "ms") {
			result.push(entries[i][1].toFixed(precision) + entries[i][0]);
		} else {
			result.push(Math.round(entries[i][1]) + entries[i][0]);
		}
	}
	return result.join("");
}

// turns ms into a time type
function msToTime(ms: number): Time {
	let remainingMs = ms;
	const response: Time = {
		days: 0,
		hr: 0,
		min: 0,
		sec: 0,
		ms: 0,
	};

	if (remainingMs > DAY_MS) {
		response.days = Math.floor(remainingMs / DAY_MS);
		remainingMs -= response.days * DAY_MS;
	}
	if (remainingMs > HR_MS) {
		response.hr = Math.floor(remainingMs / HR_MS);
		remainingMs -= response.hr * HR_MS;
	}
	if (remainingMs > MIN_MS) {
		response.min = Math.floor(remainingMs / MIN_MS);
		remainingMs -= response.min * MIN_MS;
	}
	if (remainingMs > SEC_MS) {
		response.sec = Math.floor(remainingMs / SEC_MS);
		remainingMs -= response.sec * SEC_MS;
	}
	response.ms = remainingMs;

	return response;
}

const DAY_MS = 86400000;
const HR_MS = 3600000;
const MIN_MS = 60000;
const SEC_MS = 1000;

export function getSessionToken() {
	const token = localStorage.getItem("sessionToken");
	if (!token) {
		console.log(
			"Session token not found! Run ts-node login to authenticate to Advent of Code."
		);
		process.exit(1);
	}
	return token;
}

export function range(min: number, max: number): number[] {
	let arr: number[] = [];
	for (let i = min; i < max; i++) {
		arr.push(i);
	}
	return arr;
}

export function sum(arr: number[]): number {
	return arr.reduce((a, b) => a + b);
}

export function memoize<Args extends unknown[], Result>(
	func: (...args: Args) => Result
): (...args: Args) => Result {
	const cache = new Map<string, Result>();

	return (...args) => {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return cache.get(key)!;
		}
		const result = func(...args);
		cache.set(key, result);
		return result;
	};
}

export function splitInput(
	input: string,
	splitRegEx: RegExp = /\r?\n/
): string[] {
	return input.split(splitRegEx);
}

export function getASCII(char: string): number {
	return char.charCodeAt(0);
}

export function invertArray<T>(input: T[][]): T[][] {
	let invertedArray: T[][] = [];
	input[0].forEach(e => invertedArray.push([]));
	input.forEach((e, index) => invertedArray[index].push(e[index]));
	console.log(input);
	console.log(invertedArray);
	return invertedArray;
}

/**
 * Helper to run multiple search-and-replace operations within a string.
 * @param corpus Body of text in which to make replacements
 * @param replacements Dictionary of search => replacement. Run in sequential order.
 * @param global If false, only replace the first occurrence of each search value.
 */
export function replaceAll(
	corpus: string,
	replacements: { [search: string]: string },
	global = true
) {
	let current = corpus;
	for (const entry of Object.entries(replacements)) {
		if (global) {
			current = current.split(entry[0]).join(entry[1]);
		} else {
			current = current.replace(entry[0], entry[1]);
		}
	}
	return current;
}

/**
 * Starting from the directory this file is running in, search up
 * through folders until a "package.json" file is found. Return this
 * directory's path.
 */
export function getAppRoot() {
	let currentDir = __dirname;
	while (!existsSync(path.join(currentDir, "package.json"))) {
		currentDir = path.dirname(currentDir);
	}
	return currentDir;
}

export function getProblemUrl(day: number, year: number) {
	return `https://adventofcode.com/${year}/day/${day}`;
}
