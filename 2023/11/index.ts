import { logPerformance, logSolution } from '../../util/log';
import { getInput } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';
import { isTestOnly } from '../../run';

const YEAR = 2023;
const DAY = 11;

// Answer Two: 550359414682+, 

const galaxyMap = new Map<number, number[]>();

const GALAXY = '#';

function part1(input: string, ...params: unknown[]) {
	let rows = input.split('\n');

	const addRowAfter: number[] = [];
	const addColAfter: number[] = [];
	const emptyGalaxyMap = new Map<number, number>();
	for(let i = 0; i < rows[0].length; i++) emptyGalaxyMap.set(i, 0);

	// Process map and save nodes
	let galaxyCount = 0;
	for(let i = 0; i < rows.length; i++) {
		const row = rows[i].split('');

		const startingGalaxyCount = galaxyCount;
		for (let j = 0; j < row.length; j++) {
			if (row[j] === GALAXY) {
				galaxyMap.set(galaxyCount, [i, j]);
				galaxyCount++;
				emptyGalaxyMap.set(j, (emptyGalaxyMap.get(j) ?? 0) + 1);
			}
		}

		if (startingGalaxyCount === galaxyCount) addRowAfter.push(i);
	}
	emptyGalaxyMap.forEach((value, key) => {
		if (value === 0) addColAfter.push(key);
	});

	const galaxies: number[][] = [];
	galaxyMap.forEach((value, key) => {
		galaxies.push(value);
	});
	
	let sumOfPaths = 0;
	for (let i = 0; i < galaxies.length; i++) {
		for (let j = i + 1; j < galaxies.length; j++) {
			sumOfPaths += calculateDistance(galaxies[i], galaxies[j], addColAfter, addRowAfter);
		}
	}

	return sumOfPaths;
}

function part2(input: string, ...params: unknown[]) {
	let rows = input.split('\n');
	let n = (params[0] as number[])[0];
	console.log(n)

	const addRowAfter: number[] = [];
	const addColAfter: number[] = [];
	const emptyGalaxyMap = new Map<number, number>();
	for(let i = 0; i < rows[0].length; i++) emptyGalaxyMap.set(i, 0);

	// Process map and save nodes
	let galaxyCount = 0;
	for(let i = 0; i < rows.length; i++) {
		const row = rows[i].split('');

		const startingGalaxyCount = galaxyCount;
		for (let j = 0; j < row.length; j++) {
			if (row[j] === GALAXY) {
				galaxyMap.set(galaxyCount, [i, j]);
				galaxyCount++;
				emptyGalaxyMap.set(j, (emptyGalaxyMap.get(j) ?? 0) + 1);
			}
		}

		if (startingGalaxyCount === galaxyCount) addRowAfter.push(i);
	}
	emptyGalaxyMap.forEach((value, key) => {
		if (value === 0) addColAfter.push(key);
	});

	const galaxies: number[][] = [];
	galaxyMap.forEach((value, key) => {
		galaxies.push(value);
	});

	console.log(addColAfter)
	console.log(addRowAfter)
	
	let sumOfPaths = 0;
	for (let i = 0; i < galaxies.length; i++) {
		for (let j = i + 1; j < galaxies.length; j++) {
			sumOfPaths += calculateDistance(galaxies[i], galaxies[j], addColAfter, addRowAfter, n);
		}
	}

	return sumOfPaths;
}

function calculateDistance(a: number[], b: number[], extraCols: number[], extraRows: number[], n: number = 1) {
	let extraColCount = 0;
	let extraRowCount = 0;
	extraCols.forEach(col => {
		if ((col > a[1] && col < b[1]) || (col < a[1] && col > b[1])) {
			extraColCount++;
		}
	});
	extraRows.forEach(row => {
		if ((row > a[0] && row < b[0]) || (row < a[0] && row > b[0])) {
			extraRowCount ++;
		}
	});
	
	return Math.abs(b[1] - a[1]) + Math.abs(b[0] - a[0]) + (extraColCount * (n > 1 ? n - 1 : 1)) + (extraRowCount * (n > 1 ? n - 1 : 1));
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
			solution: '374',
			args: []
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
			solution: '8410',
			args: [100]
		}
	];

	// Run Tests
	for (const testCase of part1Tests) {
		logTestResult(testCase, String(part1(testCase.input)));
	}

	for (const testCase of part2Tests) {
		logTestResult(testCase, String(part2(testCase.input, testCase.args)));
	}

	if (!isTestOnly()) {
		// Get input and run program
		const input = await getInput(DAY, YEAR);
		const part1Before = performance.now();
		const part1Solution = String(part1(input));
		const part1After = performance.now();

		const part2Before = performance.now();
		const part2Solution = String(part2(input, [1000000]))
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
