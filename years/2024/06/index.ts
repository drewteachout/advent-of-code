import { log, logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2024;
const DAY = 6;

function isLeftAndRight(char: string): boolean {
	return ['<', '>'].includes(char);
}

function isUpAndDown(char: string): boolean {
	return ['^', 'v'].includes(char);
}

function isGuard(char: string): boolean {
	return isLeftAndRight(char) || isUpAndDown(char);
}

function part1(input: string, ...params: unknown[]) {
	const rows = input.split('\n');
	log(rows)
	let [x, y] = [0, 0];
	let guard = '';
	rowLoop:
	for (let i = 0; i < rows.length; i++) {
		for (let j = 0; j < rows[i].length; j++) {
			if (isGuard(rows[i][j])) {
				x = i;
				y = j;
				guard = rows[i][j];
				break rowLoop;
			}
		}
	}
	console.log(x, y);
	console.log(guard);
	let locationsVisited = [`${x},${y}`];
	while((x >= 0 && x < rows[0].length) && (y >= 0 && y < rows.length)) {
		if ((x === 0 && guard === '^')
			|| (x === rows[0].length - 1 && guard === 'v')
			|| (y === 0 && guard === '<')
			|| (y === rows.length - 1 && guard ==='>')
		) {
			locationsVisited.push(`${x},${y}`);
			break;
		}

		if (isUpAndDown(guard)) {
			if (guard === '^') {
				const nextSpace = rows[x-1][y];
				if (nextSpace === '#') {
					guard = '>';
				} else {
					x--;
				}
			} else {
				const nextSpace = rows[x+1][y];
				if (nextSpace === '#') {
					guard = '<';
				} else {
					x++;
				}
			}
		} else {
			if (guard === '<') {
				const nextSpace = rows[x][y-1];
				if (nextSpace === '#') {
					guard = '^';
				} else {
					y--;
				}
			} else {
				const nextSpace = rows[x][y+1];
				if (nextSpace === '#') {
					guard = 'v';
				} else {
					y++;
				}
			}
		}
		locationsVisited.push(`${x},${y}`);
	}

	return new Set(locationsVisited).size ?? 0;
}

function part2(input: string, ...params: unknown[]) {
	// TODO: Calculate the path

	// Check for a loop by putting an obstacle on every spot in the path


	return 'Not implemented';
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
			solution: '41'
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
