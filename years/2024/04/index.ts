import { logPerformance, logSolution } from "utilities/log";
import { getInput } from "utilities/util";
import { TestCase, logTestResult } from "utilities/test";
import { isTestOnly } from "../../../run";

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
	const formattedInput = input.split("\n");
	let count = 0;
	formattedInput.forEach(l => {
		count += countOccurrencesInRows(l, MATCH_ARRAY);
	});
	console.log("Horizontal: ", count);

	// Create vertical input
	const verticalInput = [];
	for (let i = 0; i < formattedInput[0].length; i++) {
		let vertical = "";
		formattedInput.forEach(input => {
			vertical += input[i];
		});
		verticalInput.push(vertical);
	}
	verticalInput.forEach(i => {
		count += countOccurrencesInRows(i, MATCH_ARRAY);
	});
	console.log("Vertical: ", count);

	// Create diagonal input
	// (i,j)
	// (0,0)
	// (1,0), (0, 1)
	// (2,0), (1, 1), (0, 2)
	// ...
	// (9,8)
	// (9,9)
	const diagonalInput = [];

	for (let i = 0; i < formattedInput.length; i++) {
		let diagonal = "";
		let inverseDiagonal = "";
		for (let j = 0; j <= i; j++) {
			diagonal += formattedInput[i - j][j];
			inverseDiagonal +=
				formattedInput[formattedInput.length - i - j][
					formattedInput.length - j
				];
		}
		diagonalInput.push(diagonal);
		diagonalInput.push(inverseDiagonal);
	}
	console.log(diagonalInput);

	// const diagonalInput = [];
	// console.log(formattedInput);
	// let diagonal = '';
	// // (0,0), (1,1), ... (5, 5)
	// for (let i = 0; i < formattedInput.length; i++) {
	// 	diagonal += formattedInput[i][i];
	// }
	// diagonalInput.push(diagonal);

	// // (1, 0), (2, 1) ... (5, 4)
	// // Lower diagonal
	// for (let i = 1; i < formattedInput.length; i++) {
	// 	diagonal = '';
	// 	for (let j = i; j < formattedInput[0].length; j++) {
	// 		diagonal += formattedInput[j][j - i];
	// 	}
	// 	diagonalInput.push(diagonal);
	// }

	// // Upper diagonal
	// // (0,1), (1, 2), ... (4, 5)
	// for (let i = 0; i < formattedInput.length - 1; i++) {
	// 	diagonal = '';
	// 	for (let j = i; j < formattedInput[0].length - 1; j++) {
	// 		diagonal += formattedInput[j - i][j + 1];
	// 	}
	// 	diagonalInput.push(diagonal);
	// }

	// // Create Reverse Diagonal
	// // (0, 9), (1, 8), (2, 7), ...(9, 0)
	// diagonal = '';
	// for (let i = 0; i < formattedInput.length; i++) {
	// 	diagonal += formattedInput[i][formattedInput.length - 1 - i];
	// }
	// diagonalInput.push(diagonal);

	// // Upper reverse diagonal
	// // (0, 8), (1, 7), (2, 6), (3, 5), (4, 4), (5,3), (6,2), (7, 1), (8,0)
	// for (let i = 0; i < formattedInput.length - 1; i++) {
	// 	diagonal = '';
	// 	for (let j = i; j < formattedInput[0].length - 1; j++) {
	// 		diagonal += formattedInput[j][formattedInput[0].length - j - 2];
	// 	}
	// 	diagonalInput.push(diagonal);
	// }

	// // Lower reverse diagonal
	// // (1,9), (2,8), (3,7), (4,6), (5,5), (6,4), (7,3), (8,2), (9,1)
	// // (2,9), (3,8)
	// for (let i = 1; i < formattedInput.length; i++) {
	// 	diagonal = '';
	// 	for (let j = 0; j < formattedInput[0].length - i; j++) {
	// 		// console.log(`(${i + j},${formattedInput[0].length - j - 1})`);
	// 		diagonal += formattedInput[i + j][formattedInput[0].length - j - 1];
	// 	}
	// 	console.log(diagonal);
	// 	diagonalInput.push(diagonal);
	// }

	diagonalInput.forEach(i => {
		count += countOccurrencesInRows(i, MATCH_ARRAY);
	});

	// console.log(diagonalInput);
	// console.log(diagonalInput.length);
	// console.log("Diagonal: ", count);

	return count;
}

function part2(input: string, ...params: unknown[]) {
	return "Not implemented";
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
			solution: "18",
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
			solution: "18",
		},
		{
			input: `..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
			solution: "4",
		},
	];
	const part2Tests: TestCase[] = [
		{
			input: ``,
			solution: "",
		},
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
