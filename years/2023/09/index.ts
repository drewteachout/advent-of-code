import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 9;

// Part 1 Answers: 2548890836+, 31584128-, 1955513104

function part1(input: string, ...params: unknown[]) {
	const histories = input.split('\n');

	const solution = histories.map(history => {
		const values: number[] = history.match(/-?\d+/g)?.map(x => Number(x)) ?? [];
		return calcHistory(values);
	});

	return solution.reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	const histories = input.split('\n');

	console.log(histories)

	const solution = histories.map(history => {
		const values: number[] = history.match(/-?\d+/g)?.map(x => Number(x)) ?? [];
		return calcHistoryBackwards(values);
	});
	console.log(solution)

	return solution.reduce((a, b) => a + b);
}

function calcHistory(values: number[]): number {
	if (values.length === 0)
		return 0;

	let newValues: number[] = [];
	for (let i = 1; i < values.length; i++) {
		newValues.push(values[i] - values[i-1]);
	}

	if (newValues.every(v => v === 0))
		return values[values.length - 1];
	else
		return values[values.length - 1] + calcHistory(newValues)
}

function calcHistoryBackwards(values: number[]): number {
	if (values.length === 0)
		return 0;

	let newValues: number[] = [];
	for (let i = 1; i < values.length; i++) {
		newValues.push(values[i] - values[i-1]);
	}

	// console.log('\nNew Values: ', newValues)
	// console.log('Calc History: ', calcHistoryBackwards(newValues))

	if (newValues.every(v => v === 0))
		return values[0];
	else
		return values[0] - calcHistoryBackwards(newValues);
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
			solution: '114',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
			solution: '2',
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
