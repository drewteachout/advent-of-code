import { logPerformance, logSolution } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2024;
const DAY = 5;

let mustComeAfterMap = new Map<string, string[]>();
let mustComeBeforeMap = new Map<string, string[]>();
function isValidPage(page: string): boolean {
	const numbers = page.split(',');
	let isValid = true;
	numbers.forEach((n, i) => {
		const mustComeAfter = mustComeAfterMap.get(n) ?? [];
		const mustComeBefore = mustComeBeforeMap.get(n) ?? [];
		const after = numbers.slice(i + 1);
		const before = numbers.slice(0, i);
		// check all after
		if (!after.every(e => mustComeAfter.includes(e))) {
			isValid = false;
		}
		// check all before
		if (!before.every(e => mustComeBefore.includes(e))) {
			isValid = false;
		}
	});

	return isValid;
}

function part1(input: string, ...params: unknown[]) {
	const [rules, pages] = input.split('\n\n');
	// Create map
	rules.split('\n').forEach(r => {
		const [key, value] = r.split('|');
		const v = mustComeAfterMap.get(key) ?? [];
		const k = mustComeBeforeMap.get(value) ?? [];
		v.push(value);
		k.push(key);
		mustComeAfterMap.set(key, v);
		mustComeBeforeMap.set(value, k);
	});

	// Process pages
	const validPages = pages
		.split('\n')
		.filter(p => isValidPage(p))
		.map(p => p.split(',').map(n => Number(n)));

	return validPages.map(p => p[Math.floor(p.length / 2)]).reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	mustComeAfterMap = new Map<string, string[]>();
	mustComeBeforeMap = new Map<string, string[]>();
	const [rules, pages] = input.split('\n\n');
	// Create map
	rules.split('\n').forEach(r => {
		const [key, value] = r.split('|');
		const v = mustComeAfterMap.get(key) ?? [];
		const k = mustComeBeforeMap.get(value) ?? [];
		v.push(value);
		k.push(key);
		mustComeAfterMap.set(key, v);
		mustComeBeforeMap.set(value, k);
	});

	const invalidPages = pages
		.split('\n')
		.filter(p => !isValidPage(p))
		.map(p => p.split(','));

	const sortedPages: string[][] = [];
	invalidPages.forEach(p => {
		p.sort((a, b) => ((mustComeBeforeMap.get(a) ?? []).includes(b) ? 1 : -1));
		sortedPages.push(p);
	});

	return sortedPages
		.map(p => p[Math.floor(p.length / 2)])
		.map(x => Number(x))
		.reduce((a, b) => a + b);
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
			solution: '143'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
			solution: '123'
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
