import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2024;
const DAY = 1;

function createLists(input: string) {
	const list1: number[] = [];
	const list2: number[] = [];
	input.split('\n').forEach(r => {
		const entries = r.split('   ');
		list1.push(Number(entries[0]));
		list2.push(Number(entries[1]));
	});

	return [list1, list2];
}

function part1(input: string, ...params: unknown[]) {
	const [list1, list2] = createLists(input);

	list1.sort((a, b) => a - b);
	list2.sort((a, b) => a - b);

	const diffArr: number[] = [];
	for (let i = 0; i < list1.length; i++) {
		diffArr.push(Math.abs(list1[i] - list2[i]));
	}

	return diffArr.reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	const [list1, list2] = createLists(input);

	const similarityArr = [];
	for (let i = 0; i < list1.length; i++) {
		const count = list2.filter(x => x == list1[i]).length;
		similarityArr.push(list1[i] * count);
	}

	return similarityArr.reduce((a, b) => a + b);
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `3   4
4   3
2   5
1   3
3   9
3   3`,
			solution: '11'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `3   4
4   3
2   5
1   3
3   9
3   3`,
			solution: '31'
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
