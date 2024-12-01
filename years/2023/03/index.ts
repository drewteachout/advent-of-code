import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 3;

let consoleIndex = 137;

const SYMBOLS_REGEX = /[^0-9|.]/g

function part1(input: string, ...params: unknown[]) {
	const inputRows = input.split('\n');
	let sum = 0;
	inputRows.forEach((row, index) => 
		{
			const codes = row.matchAll(/[^0-9]?[0-9]+[^0-9]?/g) ?? [];
			
			[...codes].forEach(code => {
				const topIndex = index - 1;
				const bottomIndex = index + 1
				let startIndex = code.index ?? 0;
				const endIndex = startIndex + code[0].length;

				if (code[0][0].match(/\d/)) {
					startIndex = startIndex > 0 ? startIndex - 1 : startIndex;
				}

				const topRow: string = topIndex >= 0 ? inputRows[topIndex].substring(startIndex, endIndex) : '';
				const bottomRow: string = bottomIndex < inputRows.length ? inputRows[bottomIndex].substring(startIndex, endIndex) : '';
				const currentRow: string = row.substring(startIndex, endIndex);
				const adjacents = topRow + currentRow + bottomRow;

				if (adjacents.match(SYMBOLS_REGEX) !== null) {
					sum += Number(code[0].match(/\d+/g)?.pop() ?? 0);
				}
			});
		});
	return sum;
}

function part2(input: string, ...params: unknown[]) {
	const inputRows = input.split('\n');
	let sum = 0;
	inputRows.forEach((row, index) => 
		{
			if (index === consoleIndex) {
				console.log('Row: ', index + 1)
			}
			const codes = row.matchAll(/\*/g) ?? [];

			[...codes].forEach(code => {
				if (code.index) {
					const topIndex = index - 1;
					const bottomIndex = index + 1;
					const startIndex = code.index > 0 ? code.index - 1 : code.index;
					const endIndex =  code.index + 1 !== row.length ? code.index + code[0].length : code.index;

					let ratios: number[] = [];

					const topRowMatches = topIndex >= 0 ? [...inputRows[topIndex].matchAll(/\d+/g)] : [];
					const bottomRowMatches = bottomIndex < inputRows.length ? [...inputRows[bottomIndex].matchAll(/\d+/g)] : [];
					const currentRowMatches = [...row.matchAll(/\d+/g)];
					
					topRowMatches.forEach(m => {
						const mStart = m.index ?? -1;
						const mEnd = mStart + m[0].length - 1;

						if ((startIndex >= mStart && startIndex <= mEnd) || (endIndex >= mStart && endIndex <= mEnd) || (mStart === mEnd && mStart >= startIndex && mEnd <= endIndex)) {
							ratios.push(Number(m[0]))
						} 
					});

					currentRowMatches.forEach(m => {
						const mStart = m.index ?? -1;
						const mEnd = mStart + m[0].length - 1;

						if (startIndex === mEnd || endIndex === mStart) {
							ratios.push(Number(m[0]));
						}
					});

					
					bottomRowMatches.forEach(m => {
						const mStart = m.index ?? -1;
						const mEnd = mStart + m[0].length - 1;

						// if (index === consoleIndex) {
						// 	console.log(m[0])
						// 	console.log('Match Start: ', mStart);
						// 	console.log('match End: ', mEnd);
						// 	console.log('Start: ', startIndex)
						// 	console.log('End: ', endIndex)
						// }

						if (index === consoleIndex && mStart === 122) {
							console.log(m[0])
							console.log('Match Start: ', mStart);
							console.log('match End: ', mEnd);
							console.log('Start: ', startIndex)
							console.log('End: ', endIndex)
						}

						if ((startIndex >= mStart && startIndex <= mEnd) || (endIndex >= mStart && endIndex <= mEnd) || (mStart === mEnd && mStart >= startIndex && mEnd <= endIndex)) {
							ratios.push(Number(m[0]))
						}
					});
					if (index === consoleIndex)
					{
						// console.log(bottomRowMatches)
						console.log(ratios)
					}

					// if (ratios.length === 1 || ratios.length > 2) {
					// 	console.log('Row: ', index + 1);
					// 	console.log(ratios);
					// }

					if (ratios.length === 2) {
						// console.log('Row: ', index + 1)
						if (index === consoleIndex)
							console.log(ratios[0]*ratios[1])
						sum += ratios[0] * ratios[1];
					}

					// if (index === consoleIndex) {
					// 	console.log(ratios)
					// 	// console.log(ratios[0] * ratios[1])
					// 	console.log('Sum: ', sum)
					// }
				}
			})
		});
	return sum;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
			solution: '4361',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
			solution: '467835',
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
