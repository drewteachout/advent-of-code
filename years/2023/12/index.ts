import { logPerformance, logSolution } from 'utilities/log';
import { getInput, memoize, sum } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 12;

// Answer 1: 7197+

function part1(input: string, ...params: unknown[]) {
	const rows = input.split('\n');

	const solution = rows.map(row => {
		const springs = row.match(/[.?#]+/g)?.map(s => String(s))[0] ?? '';
		const groups = row.match(/\d+/g)?.map(n => Number(n)) ?? [];
		const output = countPossibilities(springs, groups);
		return Number(output);
	});


	return solution.reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	const rows = input.split('\n');

	const solution = rows.map(row => {
		let springs = row.match(/[.?#]+/g)?.map(s => String(s))[0] ?? '';
		let groups = row.match(/\d+/g)?.map(n => Number(n)) ?? [];
		springs = [springs, springs, springs, springs, springs].join('?');
		groups = [...groups, ...groups, ...groups, ...groups, ...groups];
		const output = countPossibilities(springs, groups);
		return output;
	});

	return solution.reduce((a, b) => a + b);
}

const countPossibilities = memoize((springs: string, groups: number[], debug: boolean = false): number => {
	// Base Cases
	// No springs left
	if (springs.length === 0) {
		if (groups.length === 0)
			return 1;
		return 0;
	}
		

	// No groups left to fill
	if (groups.length === 0) {
		// If there are still broken gears its invalid
		if (springs.includes('#')) 
			return 0;
		return 1;
	}

	// Spring is not long enough to hold all groups
	if (springs.length < sum(groups) + groups.length - 1)
		return 0;

	// Next Elements
	const nextSpring = springs[0];

	// Next spring is a '.'
	if (nextSpring === '.')
		return countPossibilities(springs.slice(1), groups, debug);
	if (nextSpring === '#') {
		const [group, ...leftOverGroups] = groups;
		if (springs.slice(0, group).includes('.'))
			return 0;
		if (springs[group] === '#')
			return 0;
		return countPossibilities(springs.slice(group + 1), leftOverGroups);
	}

	// If NextSpring is '?' add up possibilities of it being '#' or '.'
	return (countPossibilities('#' + springs.slice(1), groups, debug) + countPossibilities('.' + springs.slice(1), groups, debug));
});

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
			solution: '21'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
			solution: '525152'
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
