import { logPerformance, logSolution } from 'utilities/log';
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
	console.log(rows);
	let [x, y] = [0, 0];
	let currentPos = '';
	let positionMap = new Map<string, number>();
	for (let i = 0; i < rows.length; i++) {
		for (let j = 0; j < rows[i].length; j++) {
			if (isGuard(rows[i][j])) {
				x = i;
				y = j;
				currentPos = rows[i][j];
			}
			positionMap.set(`${i},${j}`, 0);
		}
	}

	console.log(positionMap);
	console.log(x, y);
	console.log(currentPos);
	let solution = [];
	while (!solution.length && x < rows.length) {
		while (!solution.length && y < rows[x].length && isLeftAndRight(currentPos)) {
			if ((y === 0 && currentPos === '<') || (y === rows[x].length - 1 && currentPos === '>')) {
				solution = [...positionMap.values()].filter(v => v > 0);
			}
			const nextSpace = currentPos === '<' ? rows[x][y - 1] : rows[x][y + 1];

			// handle turn
			if (nextSpace === '#') {
				// turn to the right
				currentPos = currentPos === '<' ? '^' : 'v';
			} else {
				y++;
				positionMap.set(`${x},${y}`, (positionMap.get(`${x},${y}`) ?? 0) + 1);
			}
		}

		if ((x === 0 && currentPos === '^') || (x === rows.length - 1 && currentPos === 'v')) {
			solution = [...positionMap.values()].filter(v => v > 0);
		}
		const nextSpace = currentPos === '<' ? rows[x][y - 1] : rows[x][y + 1];

		// handle turn
		if (nextSpace === '#') {
			// turn to the right
			currentPos = currentPos === '^' ? '>' : '<v>';
		} else {
			x++;
			positionMap.set(`${x},${y}`, (positionMap.get(`${x},${y}`) ?? 0) + 1);
		}
	}
	console.log(positionMap);
	console.log([...positionMap.values()].filter(v => v > 0));

	return solution?.length ?? 0;
}

function part2(input: string, ...params: unknown[]) {
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
