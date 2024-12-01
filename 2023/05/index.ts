import { logPerformance, logSolution } from '../../util/log';
import { getInput, range } from '../../util/util';
import { TestCase, logTestResult } from '../../util/test';
import { isTestOnly } from '../../run';

const YEAR = 2023;
const DAY = 5;

function part1(input: string, ...params: unknown[]) {
	const maps = input.split('\n\n');
	const seeds = maps[0].match(/\d+/g)?.map(n => Number(n));

	// Input Maps
	const seedToSoilMapInput = maps.find(m => m.includes('seed-to-soil map')) ?? '';
	const soilToFertilizerMapInput = maps.find(m => m.includes('soil-to-fertilizer')) ?? '';
	const fertilizerToWaterInput = maps.find(m => m.includes('fertilizer-to-water')) ?? '';
	const waterToLightInput = maps.find(m => m.includes('water-to-light')) ?? '';
	const lightToTemperatureInput = maps.find(m => m.includes('light-to-temperature')) ?? '';
	const temperatureToHumidityInput = maps.find(m => m.includes('temperature-to-humidity')) ?? '';
	const humidityToLocationInput = maps.find(m => m.includes('humidity-to-location')) ?? '';

	const solution = seeds
		?.map(seed => sourceToDestination(seed, seedToSoilMapInput))
		.map(soil => sourceToDestination(soil, soilToFertilizerMapInput))
		.map(fertilizer => sourceToDestination(fertilizer, fertilizerToWaterInput))
		.map(water => sourceToDestination(water, waterToLightInput))
		.map(light => sourceToDestination(light, lightToTemperatureInput))
		.map(temperature => sourceToDestination(temperature, temperatureToHumidityInput))
		.map(humidity => sourceToDestination(humidity, humidityToLocationInput)) ?? [-1];

	return Math.min(...solution);
}

function part2(input: string, ...params: unknown[]) {
	const maps = input.split('\n\n');
	const seeds = maps[0].match(/\d+ \d+/g);

	// Input Maps
	const seedToSoilMapInput = maps.find(m => m.includes('seed-to-soil map')) ?? '';
	const soilToFertilizerMapInput = maps.find(m => m.includes('soil-to-fertilizer')) ?? '';
	const fertilizerToWaterInput = maps.find(m => m.includes('fertilizer-to-water')) ?? '';
	const waterToLightInput = maps.find(m => m.includes('water-to-light')) ?? '';
	const lightToTemperatureInput = maps.find(m => m.includes('light-to-temperature')) ?? '';
	const temperatureToHumidityInput = maps.find(m => m.includes('temperature-to-humidity')) ?? '';
	const humidityToLocationInput = maps.find(m => m.includes('humidity-to-location')) ?? '';

	const solution = seeds
		?.flatMap(seed => sourceToDestinationRange(Number(seed.split(' ')[0]), Number(seed.split(' ')[1]), seedToSoilMapInput))
		.flatMap(soil => sourceToDestinationRange(Number(soil.split(' ')[0]), Number(soil.split(' ')[1]), soilToFertilizerMapInput))
		.flatMap(fertilizer => sourceToDestinationRange(Number(fertilizer.split(' ')[0]), Number(fertilizer.split(' ')[1]), fertilizerToWaterInput))
		.flatMap(water => sourceToDestinationRange(Number(water.split(' ')[0]), Number(water.split(' ')[1]), waterToLightInput))
		.flatMap(light => sourceToDestinationRange(Number(light.split(' ')[0]), Number(light.split(' ')[1]), lightToTemperatureInput)) // unconfirmed
		.flatMap(temperature => sourceToDestinationRange(Number(temperature.split(' ')[0]), Number(temperature.split(' ')[1]), temperatureToHumidityInput))
		.flatMap(humidity => sourceToDestinationRange(Number(humidity.split(' ')[0]), Number(humidity.split(' ')[1]), humidityToLocationInput))
		.map(location => Number(location.split(' ')[0])) ?? [-1];

	return Math.min(...solution);
}

function sourceToDestination(source: number, input: string): number {
	let destination = source;
	input?.split('\n').forEach(v => {
		const numbers = v.split(' ').map(n => Number(n));
		if (numbers?.length === 3) {
			const dest = numbers[0];
			const src = numbers[1];
			const range = numbers[2];

			if (source >= src && source < src + range) {
				destination += dest - src;
			}
		}
	});
	return destination;
}

function sourceToDestinationRange(start: number, range: number, input: string): string[] {
		let destination: string[] = [`${start} ${range}`];

		input?.split('\n').forEach(v => {
			const numbers = v.split(' ').map(n => Number(n));
			if (numbers?.length === 3) {
				const destMap = numbers[0];
				const srcMap = numbers[1];
				const rangeMap = numbers[2];
				if (start >= srcMap && start + range <= srcMap + rangeMap) {
					// Completely within
					destination = [`${start + destMap - srcMap} ${range}`];
				} else if (start >= srcMap && start < srcMap + rangeMap && start + range > srcMap + rangeMap) {
					// Split in two - above range
					const newStart = start + destMap - srcMap;
					const newRange = srcMap + rangeMap - start;
					destination = [`${newStart} ${newRange}`, ...sourceToDestinationRange(start + newRange, range - newRange, input)];
				} else if (start < srcMap && start + range > srcMap && start + range <= srcMap + rangeMap) {
					// Split in two - below range
					const newStart = destMap;
					const newRange = range - (srcMap - start);
					destination = [`${newStart} ${newRange}`, ...sourceToDestinationRange(start, srcMap - start, input)];
				}
			}
		});

		return destination;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
			solution: '35',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
			solution: '46',
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
