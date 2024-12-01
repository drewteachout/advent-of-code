import { logPerformance, logSolution } from '../../util/log';
import { getInput, invertArray, splitInput } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';
import { isTestOnly } from '../../run';

const YEAR = 2023;
const DAY = 13;

function part1(input: string, ...params: unknown[]) {
	const patterns = splitInput(input, /\n\n/).map(p => p.split('\n').map(l => l.split('')));
	const invertedPatterns = patterns.map(p => invertArray(p));
	
	// patterns.forEach(p => {
	// 	console.log(p)
	// });

	// invertedPatterns.forEach(p => {
	// 	console.log(p)
	// })


	return 'Not implemented';
}

function part2(input: string, ...params: unknown[]) {
	return 'Not implemented';
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
			solution: '405'
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
