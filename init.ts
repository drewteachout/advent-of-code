import fetch from 'cross-fetch';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { mkdirp } from 'mkdirp';
import { getAllYears, getDayRoot, getLatestPuzzleDate, pathJoin, wait } from './util/util';
import { END_DAY } from '.';
import { getSessionToken } from './util/util';

type Config = {
	retrieve: boolean;
	seed: boolean;
	wait: boolean;
	years: number[];
}

let config: Config;

const AOC_INPUT_TEMPLATE = 'https://adventofcode.com/{year}/day/{day}/input';

function parseArgs() {
	const args = process.argv.slice(2);

	const yearIndex = args.findIndex(a => a === '--year' || a === '-y');
	const yearArg = yearIndex >= 0 ? args[yearIndex + 1] : String(getLatestPuzzleDate().year);
	
	config = {
		retrieve: args.includes('retrieve'),
		seed: args.includes('seed'),
		wait: args.includes('--wait'),
		years: yearArg === 'all' ? getAllYears() : [Number(yearArg)]
	}
}

function getReleaseTime(day: number, year: number) {
	const inCurrentTZ = new Date(year, 11, day, 5);
	return new Date(inCurrentTZ.getTime() - inCurrentTZ.getTimezoneOffset() * 60 * 1000);
}


async function retrieve() {
	// TODO: get problem data
}

async function getDayData(day: number, year: number): Promise<string> {
	const sessionToken = await getSessionToken();
	console.log(sessionToken)
	let uri = AOC_INPUT_TEMPLATE;
	// uri.replace('{year}', String(year));
	// uri.replace('{day}', String(day));
	uri = uri.split('{year}').join(String(year));
	uri = uri.split('{day}').join(String(day));

	const result = await fetch(uri, {
		headers: {
			cookie: `session=${sessionToken}`
		},
	});

	if (result.status === 200) {
		return result.text();
	} else if (result.status !== 404) {
		throw new Error(
			'Did not get a 200 status code requesting data. Did your token expire? Try running `npx ts-node login.ts` again. Error code: ' +
				result.status
		);
	} else {
		throw new Error('Received a 404. Is the puzzle released yet?');
	}
}

async function retrieveDay(day: number, year: number) {
	const dataPath = pathJoin(getDayRoot(day, year), 'data.txt');

	if(!fs.existsSync(dataPath)) {
		const releaseTime = getReleaseTime(day, year);
		console.log(day)
		if (new Date().getTime() >= releaseTime.getTime()) {
			// console.log(`Fetching data for year: ${year}, day: ${day}.`);
			const data = await getDayData(day, year);
			// console.log(data);
			console.log(dataPath)
			await fsPromises.mkdir(dataPath, { recursive: true});
			await fsPromises.writeFile(dataPath, data.trim(), 'utf-8');
			return true;
		}
	}

	return false;
}

async function run() {
	parseArgs();

	if(config.retrieve) {
		console.log('fetching...');
		if (config.wait) {
			const latestPuzzleAsOfTomorrow = getLatestPuzzleDate(new Date(Date.now() + 86400000));
			const actualLatestPuzzle = getLatestPuzzleDate();
			
			if (latestPuzzleAsOfTomorrow.day === actualLatestPuzzle.day && latestPuzzleAsOfTomorrow.year == actualLatestPuzzle.year) {
				console.log('The latest puzzle will not be released within the next day. Only use --wait within 1 day of the next puzzle release.')
			} else {
				const releaseTime = getReleaseTime(
					latestPuzzleAsOfTomorrow.day,
					latestPuzzleAsOfTomorrow.year
				);

				const toWait = releaseTime.getTime() - new Date().getTime() + 2500;

				console.log(`--- WAITING ${toWait}ms ---\n`)
				await wait(toWait)
			}
		}
		for (const year of config.years) {
			for (let i = 0; i < END_DAY; i++) {
				const day = i + 1;
				const isDone = await retrieveDay(day, year);
				if (isDone) {
					console.log(`Finished Fetching ${year} after day: ${day - 1}.`);
					return;
				}

				// Wait 100 ms to not overwhelm AOC site
				await wait(100);
			}
		}
	}
}

run().then(() => {
	process.exit();
});