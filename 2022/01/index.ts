import { logSolution } from '../../util/log';
import { getInput } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';

const YEAR = 2022;
const DAY = 1;

function part1(input: string, ...params: unknown[]) {
	const elves = input.split('\n\n');
	const elvesWeight = elves.map(e => e.split('\n').map(Number).reduce((p, c) => p + c));
	return Math.max(...elvesWeight);
}

function part2(input: string, ...params: unknown[]): string {
	return 'Not implemented';
}

async function run() {
	const input = await getInput(DAY, YEAR);
	console.log(input)

	const part1Tests: TestCase[] = [
		{
			input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
			solution: '24000'
		}
	];

	const part2Tests: TestCase[] = [
		{
			input: '',
			solution: '',
		}
	];

	// Run Tests
	for (const testCase of part1Tests) {
		logTestResult(testCase, String(part1(testCase.input)));
	}

	for (const testCase of part2Tests) {
		logTestResult(testCase, String(part1(testCase.input)));
	}

	const part1Solution = String(part1(input));
	const part2Solution = String(part2(input));

	logSolution(DAY, YEAR, part1Solution, part2Solution);
}

run().then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	})
