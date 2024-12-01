import { logPerformance, logSolution, logStringList } from '../../../util/log';
import { getInput, memoize, splitInput } from '../../../util/util';
import { TestCase, logTestResult } from '../../../util/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 14;

// Answer 2: 94124+, 93742

const roundRock = 'O';
const cubeRock = '#';
const freeSpace = '.';
const NUM_CYCLES = 1000000000;
// const NUM_CYCLES = 3;
type Direction = 'North' | 'South' | 'East' | 'West';

function part1(input: string, ...params: unknown[]) {
	let rows = splitInput(input).map(s => s.split(''));

	rows = flip(rows, 'North');

	let sum = 0;
	for (let i = 0; i < rows.length; i++) {
		sum += (rows[i].filter(i => i === roundRock).length * (rows.length - i));
	}

	return sum;
}

function part2(input: string, ...params: unknown[]) {
	let rows = splitInput(input).map(s => s.split(''));

	const spinMap = new Map<string, number>();

	let repeatIndexFound = false;
	let i = 0;
	while (i < NUM_CYCLES && !repeatIndexFound) {
		const currentState = rows.map(r => r.join('')).join('');
		const response = spinMap.get(currentState)
		if (response !== undefined) {
			repeatIndexFound = true;
		} else if (spinMap.get(currentState) === undefined) {
			rows = flip(rows, 'North')
			rows = flip(rows, 'West')
			rows = flip(rows, 'South')
			rows = flip(rows, 'East')
			
			spinMap.set(currentState, i);
		}
		
		i++;
	}
	let keyCount = 0;
	spinMap.forEach(() => keyCount++);

	for (let i = 0; i <= (NUM_CYCLES % keyCount) + 2; i++) {
		rows = flip(rows, 'North')
		rows = flip(rows, 'West')
		rows = flip(rows, 'South')
		rows = flip(rows, 'East')
	}

	let sum = 0;
	for (let i = 0; i < rows.length; i++) {
		sum += (rows[i].filter(i => i === roundRock).length * (rows.length - i));
	}

	return sum;
}

function flip(rows: string[][], direction: Direction = 'North'): string[][] {
	if (direction === 'North') {
		for (let i = 0; i < rows.length; i++) {
			for (let j = 0; j< rows[i].length; j++) {
				if (rows[i][j] === freeSpace) {
					let rowIndex = i;
					let roundFound = false;
					let cubeFound = false;
					while (rowIndex < rows.length && !roundFound && !cubeFound) {
						const rock = rows[rowIndex][j];
						if (rock === roundRock) {
							rows[i][j] = rows[rowIndex][j];
							rows[rowIndex][j] = freeSpace;
							roundFound = true;
						} else if (rock === cubeRock) {
							cubeFound = true;
						}
						rowIndex++;
					}
				}
			}
		}
	} else if (direction === 'South') {
		for (let i = rows.length - 1; i >= 0; i--) {
			for (let j = 0; j< rows[i].length; j++) {
				if (rows[i][j] === freeSpace) {
					let rowIndex = i;
					let roundFound = false;
					let cubeFound = false;
					while (rowIndex >= 0 && !roundFound && !cubeFound) {
						const rock = rows[rowIndex][j];
						if (rock === roundRock) {
							rows[i][j] = rows[rowIndex][j];
							rows[rowIndex][j] = freeSpace;
							roundFound = true;
						} else if (rock === cubeRock) {
							cubeFound = true;
						}
						rowIndex--;
					}
				}
			}
		}
	} else if (direction === 'East') {
		for (let i = 0; i < rows.length; i++) {
			for (let j = rows[i].length; j >= 0; j--) {
				if (rows[i][j] === freeSpace) {
					let colIndex = j;
					let roundFound = false;
					let cubeFound = false;
					while (colIndex >= 0 && !roundFound && !cubeFound) {
						const rock = rows[i][colIndex];
						if (rock === roundRock) {
							rows[i][j] = rows[i][colIndex];
							rows[i][colIndex] = freeSpace;
							roundFound = true;
						} else if (rock === cubeRock) {
							cubeFound = true;
						}
						colIndex--;
					}
				}
			}
		}
	} else if (direction === 'West') {
		for (let i = 0; i < rows.length; i++) {
			for (let j = 0; j < rows[i].length; j++) {
				if (rows[i][j] === freeSpace) {
					let colIndex = j;
					let roundFound = false;
					let cubeFound = false;
					while (colIndex < rows[i].length && !roundFound && !cubeFound) {
						const rock = rows[i][colIndex];
						if (rock === roundRock) {
							rows[i][j] = rows[i][colIndex];
							rows[i][colIndex] = freeSpace;
							roundFound = true;
						} else if (rock === cubeRock) {
							cubeFound = true;
						}
						colIndex++;
					}
				}
			}
		}
	}
	return rows;
};

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
			solution: '136'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
			solution: '64'
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
