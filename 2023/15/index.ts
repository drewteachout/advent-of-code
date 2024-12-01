import { logPerformance, logSolution } from '../../util/log';
import { getASCII, getInput, sum } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';
import { isTestOnly } from '../../run';

const YEAR = 2023;
const DAY = 15;

const HASH_FACTOR = 17;
const HASH_DIVISOR = 256;

function part1(input: string, ...params: unknown[]) {
	const steps = input.split(',');

	const solution = steps.map(step => hash(step));

	return sum(solution);
}

function part2(input: string, ...params: unknown[]) {
	const steps = input.split(',');
	const boxes = new Map<number, string[]>();
	const focalLengths = new Map<string, number>();

	steps.forEach(step => {
		// Addition
		if (step.includes('=')) {
			const label = step.split('=')[0];
			const box = hash(label);
			const fl = Number(step.split('=')[1]);
			const boxContents = boxes.get(box);

			if (boxContents) {
				if (!boxContents.includes(label)) {
					boxContents.push(label)
				}
				boxes.set(box, boxContents)
			} else {
				boxes.set(box, [label]);
			}
			focalLengths.set(label, fl);
		}
		
		// Deletion
		if (step.includes('-')) {
			const label = step.split('-')[0];
			const box = hash(label);
			let boxContents = boxes.get(box);
			if (boxContents?.includes(label)) {
				boxContents = boxContents.filter(c => c !== label);
				if (boxContents.length === 0)
					 boxes.delete(box);
				else
					boxes.set(box, boxContents);
				focalLengths.delete(label);
			}
		}
	
	});

	// Add Up the Focusing Power
	let sum = 0;
	boxes.forEach((lenses, box) => {
		lenses.forEach((l, index) => {
			sum += (box + 1) * (index + 1) * (focalLengths.get(l) ?? 1)
		});
	});

	return sum;
}

function hash(step: string): number {
	let value = 0;
	step.split('').forEach(c => value = ((value + getASCII(c)) *  HASH_FACTOR) % HASH_DIVISOR);
	return value;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
			solution: '1320'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
			solution: '145'
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
