import { logPerformance, logSolution } from '../../util/log';
import { getInput } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';
import { isTestOnly } from '../../run';
import { Node, Graph } from '../../types/graph';

const YEAR = 2023;
const DAY = 10;

function part1(input: string, ...params: unknown[]) {
	const rows = input.split('\n');

	const valueMap: string[][] = []
	
	// Build the Graph
	// Node - (i, j)
	let startX = 0;
	let startY = 0;
	for (let i = 0; i < rows.length; i++) {
		const cols = rows[i].split('').length;
		console.log(rows[i])

		for (let j = 0; j < cols; j++) {
			if (cols[j] === 'S') {
				this.startX = i;
				this.startY = j;
			} else if (cols[j] === '|') {
				
			}
		}
	}
	const start = `(${startX}, ${startY})`;
	return 'Not implemented';
}

function part2(input: string, ...params: unknown[]) {
	return 'Not implemented';
}

function findNeighbors(row: string, above: string | null, below: string | null): string[] {
	let neighbors =  ['(-1, -1)'];

	return neighbors;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `.....
.S-7.
.|.|.
.L-J.
.....`,
			solution: '4',
		},
		{
			input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
			solution: '8',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: ``,
			solution: '',
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
