import { formatTime } from "./util";

export function logSolution(day: number, year: number, part1: string, part2: string): void {
	console.log(
		`\n** ${year} Day ${String(day).padStart(2, '0')} **\n` +
		'\n--- SOLUTION ----\n\n' +
		'Part1: ' +
		part1 +
		'\nPart2: ' +
		part2
	);
}

export function logPerformance(part1ElapsedTime: number, part2ElapsedTime: number): void {
	console.log(
		'\n--- Performance ---\n\n' +
		`Part 1: ${formatTime(part1ElapsedTime)}\n` +
		`Part 2: ${formatTime(part2ElapsedTime)}`
	);
}

export function logStringList(list: string[]): void {
	list.forEach(item => console.log(item));
}