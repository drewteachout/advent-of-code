import { logPerformance, logSolution, logStringList } from 'utilities/log';
import { getInput } from 'utilities/util';
import { TestCase, logTestResult } from 'utilities/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 8;

// Answers: 831, 832, 830

function part1(input: string, ...params: unknown[]) {
	const directions = input.split('\n\n')[0];
	const nodes = input.split('\n\n')[1].split('\n');

	// create map
	const nodeNetwork = new Map<string, string>();
	nodes.forEach((node => {
		nodeNetwork.set(node.split(' = ')[0], node.split(' = ')[1]);
	}));
	
	const rememberedPaths = new Map<string, string>(); // <start + direction, end>
	
	let currentNode = 'AAA';
	let lastNode = 'ZZZ';
	let moves: string[] = [];
	while (currentNode != lastNode) {
		for (let d of directions) {
			const options = nodeNetwork.get(currentNode) ?? '(666, 999)';
			if (d === 'L' && currentNode !== lastNode) {
				currentNode = getNode(options, true);
				moves.push(currentNode);
			} else if (d === 'R' && currentNode !== lastNode) {
				currentNode = getNode(options, false);
				moves.push(currentNode);
			}
		}
	}

	return moves.length;
}

function part2(input: string, ...params: unknown[]) {
	const directions = input.split('\n\n')[0];
	const nodes = input.split('\n\n')[1].split('\n');

	// create map
	const nodeNetwork = new Map<string, string>();
	nodes.forEach((node => {
		nodeNetwork.set(node.split(' = ')[0], node.split(' = ')[1]);
	}));

	let currentNodes: string[] = [];
	let endingNodes: string[] = [];
	nodes.forEach(node => {
		if (node[2] === 'A')
			currentNodes.push(node.split(' = ')[0]);
		if (node[2] === 'Z')
			endingNodes.push(node.split(' = ')[0]);
	});

	// lcm

	const nodeSteps = currentNodes.map(node => {
		let currentNode = node;
	
		let moves = 0;
		while (!endingNodes.includes(currentNode)) {
			for (let d of directions) {
				const options = nodeNetwork.get(currentNode) ?? '(666, 999)';
				if (d === 'L' && !endingNodes.includes(currentNode)) {
					currentNode = getNode(options, true);
					moves++;
				} else if (d === 'R' && !endingNodes.includes(currentNode)) {
					currentNode = getNode(options, false);
					moves++;
				}
			}
		}
		return moves;
	});

	return lcm(nodeSteps);
}

function getNode(node: string, left: boolean): string {
	const matches = node.match(/([A-Z]|\d)+/g) ?? ['', ''];
	if (left)
		return matches[0];
	else
		return matches[1];
}

function gcd(a: number, b: number) {
	if (b === 0)
		return a;
	return gcd(b, a % b);
}

function lcm(arr: number[]): number {
	let ans = arr[0];
	
	for (let i = 1; i < arr.length; i++)
		ans = (arr[i] * ans) / gcd(arr[i], ans);

	return ans;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
			solution: '2',
		},
		{
			input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
			solution: '6'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
			solution: '6',
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
