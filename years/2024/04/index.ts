import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2024;
const DAY = 4;
const MATCH_ARRAY = [/XMAS/g, /SAMX/g];

function countOccurrencesInRows(
	row: string,
	matches: {
		[Symbol.match](string: string): RegExpMatchArray | null;
	}[]
) {
	let count = 0;
	matches.forEach(m => {
		count += (row.match(m) || []).length;
	});
	return count;
}

function part1(input: string, ...params: unknown[]) {
	const formattedInput = input.split('\n');
	let count = 0;
	formattedInput.forEach(l => {
		count += countOccurrencesInRows(l, MATCH_ARRAY);
	});

	// Create vertical input
	const verticalInput = [];
	for (let i = 0; i < formattedInput[0].length; i++) {
		let vertical = '';
		formattedInput.forEach(input => {
			vertical += input[i];
		});
		verticalInput.push(vertical);
	}

	verticalInput.forEach(i => {
		count += countOccurrencesInRows(i, MATCH_ARRAY);
	});

	// Create diagonal input (top left to bottom right)
	const diagonalInput = [];
	for (let i = 0; i < formattedInput.length * 2 - 1; i++) {
		let diagonal = '';
		for (let j = 0; j <= i; j++) {
			const index = i - j;
			if (index < formattedInput.length && j < formattedInput.length) {
				diagonal += formattedInput[index][j];
			}
		}
		diagonalInput.push(diagonal);
	}

	// Create diagonal input (top right to bottom left)
	for (let i = 0; i < formattedInput.length * 2 - 1; i++) {
		let diagonal = '';
		for (let j = 0; j <= i; j++) {
			const index = i - j;
			if (index < formattedInput.length && j < formattedInput.length) {
				diagonal += formattedInput[index][formattedInput.length - j - 1];
			}
		}
		diagonalInput.push(diagonal);
	}

	diagonalInput.forEach(i => {
		count += countOccurrencesInRows(i, MATCH_ARRAY);
	});

	return count;
}

function isM(char: string): boolean {
	return char === 'M';
}

function isS(char: string): boolean {
	return char === 'S';
}

function part2(input: string, ...params: unknown[]) {
	const grid = input.split('\n');
	let count = 0;
	for (let i = 1; i < grid.length - 1; i++) {
		for (let j = 1; j < grid[i].length - 1; j++) {
			if (grid[i][j] === 'A') {
				// count++;
				if (
					((isM(grid[i - 1][j - 1]) && isS(grid[i + 1][j + 1])) ||
						(isS(grid[i - 1][j - 1]) && isM(grid[i + 1][j + 1]))) &&
					((isM(grid[i - 1][j + 1]) && isS(grid[i + 1][j - 1])) ||
						(isS(grid[i - 1][j + 1]) && isM(grid[i + 1][j - 1])))
				) {
					count++;
				}
			}
		}
	}
	return count;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
			solution: '18'
		},
		{
			input: `....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX`,
			solution: '18'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`,
			solution: '9'
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
