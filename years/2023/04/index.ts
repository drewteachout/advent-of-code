import { logPerformance, logSolution } from '../../../util/log';
import { getInput } from '../../../util/util';
import { TestCase, logTestResult } from '../../../util/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 4;

function part1(input: string, ...params: unknown[]) {
	const cards = input.split('\n');
	const solution = cards.map(c => {
		const numbers = c.slice(c.indexOf(':') + 1).split('|');
		const winningNumbers = numbers[0].match(/\d+/g)?.map(n => Number(n));
		const cardNumbers = numbers[1].match(/\d+/g)?.map(n => Number(n));
		let matches = -1;
		cardNumbers?.forEach(cn => {
			if (winningNumbers?.includes(cn)) {
				matches += 1;
			}
		});
		return matches > -1 ? Math.pow(2, matches) : 0;
	});
	return solution.reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	const cards = input.split('\n');
	const cardMap = new Map<number, number>();

	cards.forEach((c, index) => {
		const numbers = c.slice(c.indexOf(':') + 1).split('|');
		const winningNumbers = numbers[0].match(/\d+/g)?.map(n => Number(n));
		const cardNumbers = numbers[1].match(/\d+/g)?.map(n => Number(n));
		let matches = cardNumbers?.filter(cn => winningNumbers?.includes(cn)).length ?? 0;
		cardMap.set(index, matches);
	});

	const solution = cards.map((c, index) => { 
		return 1 + calculateCard(index, cardMap);
	});

	return solution.reduce((a, b) => a + b);
}

function calculateCard(cardNumber: number, cardMap: Map<number, number>): number {
	const matches = cardMap.get(cardNumber) ?? 0
	let sum = matches;
	for (let i = cardNumber + 1; i < cardNumber + matches + 1; i++) {
		sum += calculateCard(i, cardMap);
	}

	return sum;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
			solution: '13',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
			solution: '30',
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
