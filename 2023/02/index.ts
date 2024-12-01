import { logPerformance, logSolution } from '../../util/log';
import { getInput } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';
import { isTestOnly } from '../../run';

const YEAR = 2023;
const DAY = 2;

const RED_CUBES = 12;
const GREEN_CUBES = 13;
const BLUE_CUBES = 14;

const maxCountMap: {[key: string]: string} = {
	'red': '12',
	'green': '13',
	'blue': '14'
};

function part1(input: string, ...params: unknown[]) {
	const games = input.split('\n').map(g => {
		// if possible return game id
		const id = g.split(':')[0].substring(5);
		const sets = g.split(':')[1];
		const invalidRedSets = sets.match(/\d+ red/g)?.filter(rb => Number(rb.split(' ')[0]) > RED_CUBES)?.length ?? 0;
		const invalidGreenSets = sets.match(/\d+ green/g)?.filter(rb => Number(rb.split(' ')[0]) > GREEN_CUBES)?.length ?? 0;
		const invalidBlueSets = sets.match(/\d+ blue/g)?.filter(rb => Number(rb.split(' ')[0]) > BLUE_CUBES)?.length ?? 0;

		if ((invalidRedSets || invalidBlueSets || invalidGreenSets) > 0)
			return 0;

		return Number(id);
	});

	return games.reduce((a, b) => a + b, 0);
}

function part2(input: string, ...params: unknown[]) {
	const games = input.split('\n').map(g => {
		const id = g.split(':')[0].substring(5);
		const sets = g.split(':')[1];
		const redSets = sets.match(/\d+ red/g)?.join(', ').match(/\d+/g)?.map(n => Number(n));
		const greenSets = sets.match(/\d+ green/g)?.join(', ').match(/\d+/g)?.map(n => Number(n));
		const blueSets = sets.match(/\d+ blue/g)?.join(', ').match(/\d+/g)?.map(n => Number(n));

		const redMin = redSets?.length ? Math.max(...redSets) : 0;
		const greenMin = greenSets?.length ? Math.max(...greenSets) : 0;
		const blueMin = blueSets?.length ? Math.max(...blueSets) : 0;

		return redMin * greenMin * blueMin;
	});

	return games.reduce((a, b) => a + b, 0);
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
			solution: '8'
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
			solution: '2286'
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
