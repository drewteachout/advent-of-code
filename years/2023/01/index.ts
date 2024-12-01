import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util'; 
import { TestCase, logTestResult } from 'utilities/test';
import { performance } from 'perf_hooks';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 1;

const digits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const spelledOutDigits: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const digitMap: {[key: string]: string} = {
	'zero': '0',
	'one': '1',
	'two': '2',
	'three': '3',
	'four': '4',
	'five': '5',
	'six': '6',
	'seven': '7',
	'eight': '8',
	'nine': '9'
};

function part1(input: string, ...params: unknown[]) {
	const values = input.split('\n').map(l => {
		const firstDigit = l.split('').find(c => isDigit(c)) ?? '';
		const lastDigit = l.split('').reverse().find(c => isDigit(c)) ?? '';
		return Number(firstDigit + lastDigit);
	});
	return values.reduce((sum, item) => sum + item, 0);
}

function part2(input: string, ...params: unknown[]) {
	const values = input.split('\n').map(v => {
		let firstIndex = v.length;
		let firstDigit = '';
		(digits.concat(spelledOutDigits)).forEach(d => {
			const i = v.indexOf(d);
			if (i < firstIndex && i >= 0) {
				firstIndex = v.indexOf(d);
				firstDigit = d.length > 1 ? digitMap[d] : d;
			}
		});

		let lastIndex = -1;
		let lastDigit = '';
		(digits.concat(spelledOutDigits)).forEach(d => {
			const i = v.lastIndexOf(d);
			if (i > lastIndex) {
				lastIndex = i;
				lastDigit = d.length > 1 ? digitMap[d] : d;
			}
		});
		
		
		return Number(firstDigit + lastDigit);
	});

	return values.reduce((sum, item) => sum + item, 0);
}

function isDigit(digit: string) {
	return digits.includes(digit);
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
			solution: '142'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
			solution: '281'
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
