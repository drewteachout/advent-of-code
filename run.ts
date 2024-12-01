
import { END_DAY, END_YEAR, START_DAY, START_YEAR } from './index';
import { getLatestPuzzleDate, getDayRoot, pathJoin } from './utilities/util';

let year: number = 0;
let day: number = 0;
let help: boolean = false;
let testOnly: boolean = false;

export function isTestOnly(): boolean {
	return testOnly;
}

const args = process.argv.slice(2);
for (const arg of args) {
	if (arg.trim() === '--debug' || arg.trim() === '-d') {
		// TODO: implement debug
	} else if (arg.trim() === '--help' || arg.trim() === '-h') {
		// TODO: implement help
		help = true;
	} else if (arg.trim() === '--test-only' || arg.trim() === '-t') {
		testOnly = true;
	} else {
		const num = Number(arg);
		if (Number.isInteger(num)) {
			if (num >= START_DAY && num <= END_DAY) {
				day = num;
			} else if (num >= START_YEAR && num < END_YEAR) {
				year = num;
			} else {
				usage();
			}
		} else {
			usage();
		}
	}
}

if ((year === 0 && day !== 0) || (year !== 0 && day === 0)) {
	usage();
}

if (help) {
	usage();
}

if (year === 0 && day === 0) {
	({ year, day } = getLatestPuzzleDate());
}

// Runs the specified test file
const puzzleFile = pathJoin(getDayRoot(day, year), 'index');
require(puzzleFile)

function usage() {
	// TODO: add console log to explain how to use
	process.exit(0);
}