import { logPerformance, logSolution } from "utilities/log";
import { getInput } from "utilities/util";
import { TestCase, logTestResult } from "utilities/test";
import { isTestOnly } from "../../../run";

const YEAR = 2024;
const DAY = 2;

function checkSafety(levels: string[]) {
	let prevDiff = 0;
	for (let i = 1; i < levels.length; i++) {
		const curr = Number(levels[i]);
		const prev = Number(levels[i - 1]);
		const diff = curr - prev;

		if (diff === 0 || diff > 3 || diff < -3) {
			return false;
		}

		if ((diff > 0 && prevDiff < 0) || (diff < 0 && prevDiff > 0)) {
			return false;
		}

		prevDiff = diff;
	}

	return true;
}

function part1(input: string, ...params: unknown[]) {
	const reports = input.split("\n");
	let unsafeReports: string[][] = [];
	reports.forEach(r => {
		const levels = r.split(" ");
		const isSafe = checkSafety(levels);
		if (!isSafe) {
			unsafeReports.push(levels);
		}
	});

	return reports.length - unsafeReports.length;
}

function part2(input: string, ...params: unknown[]) {
	const reports = input.split("\n");
	let unsafeReports: string[][] = [];
	reports.forEach(r => {
		const levels = r.split(" ");
		const isSafe = checkSafety(levels);

		if (!isSafe) {
			// Try removing each level
			let hasOneSafe = false;
			for (let i = 0; i < levels.length; i++) {
				const newLevels = [...levels];
				newLevels.splice(i, 1);
				const isSafe = checkSafety(newLevels);

				if (isSafe) {
					hasOneSafe = true;
					break;
				}
			}

			if (!hasOneSafe) {
				unsafeReports.push(levels);
			}
		}
	});

	return reports.length - unsafeReports.length;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
			solution: "2",
		},
	];
	const part2Tests: TestCase[] = [
		{
			input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
			solution: "4",
		},
	];

	// Run Tests
	for (const testCase of part1Tests) {
		logTestResult(testCase, String(part1(testCase.input)));
	}

	for (const testCase of part2Tests) {
		logTestResult(testCase, String(part2(testCase.input)));
	}

	if (!isTestOnly()) {
		// Get input and run program
		const input = await getInput(DAY, YEAR);
		const part1Before = performance.now();
		const part1Solution = String(part1(input));
		const part1After = performance.now();

		const part2Before = performance.now();
		const part2Solution = String(part2(input));
		const part2After = performance.now();

		logSolution(DAY, YEAR, part1Solution, part2Solution);

		logPerformance(part1After - part1Before, part2After - part2Before);
	}
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
