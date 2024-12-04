import { logPerformance, logSolution } from "utilities/log";
import { getInput } from "utilities/util";
import { TestCase, logTestResult } from "utilities/test";
import { isTestOnly } from "../../../run";

const YEAR = 2024;
const DAY = 3;
const INSTRUCTION_REGEX = /mul\(\d{1,3},\d{1,3}\)/g;
const MUL_REGEX = /\d{1,3}/g;
const SECTION_REGEX =
	/(^.*?(?=don't\())|((?<=do\(\)).*$)|(?<=do\().*?(?=don\'t\(\))/g;

function sumInstructions(instructions: RegExpMatchArray) {
	return instructions
		.map(i => i.match(MUL_REGEX))
		.map(a => Number(a![0]) * Number(a![1]))
		.reduce((a, b) => a + b);
}

function part1(input: string, ...params: unknown[]) {
	const instructions =
		input.replace(/\n|\r/g, "").match(INSTRUCTION_REGEX) ?? [];

	return instructions
		.map(i => i.match(MUL_REGEX))
		.map(a => Number(a![0]) * Number(a![1]))
		.reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	const sections = input.replace(/\n|\r/g, "").match(SECTION_REGEX) ?? [];

	return sections
		.flatMap(s => s.match(INSTRUCTION_REGEX) ?? [])
		.map(i => i.match(MUL_REGEX))
		.map(a => Number(a![0]) * Number(a![1]))
		.reduce((a, b) => a + b);
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)\nmul(8,5))`,
			solution: "161",
		},
	];
	const part2Tests: TestCase[] = [
		{
			input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
			solution: "48",
		},
		{
			input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))\nxmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))\n`,
			solution: "96",
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
