import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2024;
const DAY = 11;

function part1(input: string, ...params: unknown[]) {
	return 'Not implemented';
}

function part2(input: string, ...params: unknown[]) {
	return 'Not implemented';
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: ``,
			solution: ''
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: ``,
			solution: ''
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
