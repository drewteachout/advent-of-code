import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 6;

function part1(input: string, ...params: unknown[]) {
	const times = input.split('\n')[0].match(/\d+/g)?.map(n => Number(n)) ?? [];
	const distances = input.split('\n')[1].match(/\d+/g)?.map(n => Number(n)) ?? [];

	const ways = times.map((time, index) => {
		const distance = distances[index];

		let wins = 0;
		for (let i = 1; i < time - 1; i++) {
			if (i * (time - i) > distance) {
				wins += 1;
			}
		}
		return wins;
	});

	return ways.reduce((a, b) => a * b);
}

function part2(input: string, ...params: unknown[]) {
	const time = Number(input.split('\n')[0].match(/\d+/g)?.join('') ?? 0);
	const distance = Number(input.split('\n')[1].match(/\d+/g)?.join('') ?? 0);

	let wins = 0;
	for (let i = 1; i < time; i++) {
		if (i * (time - i) > distance) {
			wins += 1;
		}
	}

	return wins;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `Time:      7  15   30
Distance:  9  40  200`,
			solution: '288',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `Time:      7  15   30
Distance:  9  40  200`,
			solution: '71503',
		}
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
		const part2Solution = String(part2(input))
		const part2After = performance.now();

		logSolution(DAY, YEAR, part1Solution, part2Solution);

		logPerformance(part1After - part1Before, part2After - part2Before);
	}
}

run().then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	})
