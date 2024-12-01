import { logPerformance, logSolution } from '../../../util/log';
import { getInput } from '../../../util/util';
import { TestCase, logTestResult } from '../../../util/test';
import { isTestOnly } from '../../../run';

const YEAR = 2023;
const DAY = 7;

// Part 2:


enum Hand {
	FIVE_OF_A_KIND = 7,
	FOUR_OF_A_KIND = 6,
	FULL_HOUSE = 5,
	THREE_OF_A_KIND = 4,
	TWO_PAIR = 3,
	PAIR = 2,
	HIGH_CARD = 1,
}

const cardValue = new Map<string, number>([
	['2', 2],
	['3', 3],
	['4', 4],
	['5', 5],
	['6', 6],
	['7', 7],
	['8', 8],
	['9', 9],
	['T', 10], // 253358651
	['J', 11],
	['Q', 12],
	['K', 13],
	['A', 14]
]);

let isJokerWild = false;

function part1(input: string, ...params: unknown[]) {
	const hands = input.split('\n');

	// Do Quick Sort
	quickSort(hands);
	
	const winnings = hands.map((hand, index) => Number(hand.split(' ')[1]) * (index + 1));
	console.log(winnings)
	console.log('Worst: ', hands)
	console.log('Best: ', hands.reverse());

	return winnings.reduce((a, b) => a + b);
}

function part2(input: string, ...params: unknown[]) {
	const hands = input.split('\n');
	cardValue.set('J', 0);
	isJokerWild = true;

	quickSort(hands);

	const winnings = hands.map((hand, index) => Number(hand.split(' ')[1]) * (index + 1));
	console.log(winnings)
	console.log('Worst: ', hands)
	console.log('Best: ', hands.reverse());

	return winnings.reduce((a, b) => a + b);
}

function quickSort(hands: string[], left: number = 0, right: number = hands.length - 1): string[] {
	if (hands.length > 1) {
		const index = partition(hands, left, right);
		if (left < index - 1) {
			quickSort(hands, left, index - 1);
		}
		if (index < right) {
			quickSort(hands, index, right);
		}
	}

	return hands;
}

function partition(hands: string[], left: number = 0, right: number = hands.length - 1): number {
	const pivot = hands[Math.floor((right + left) / 2)]; // middle element
	let i = left;
	let j = right;

	while (i <= j) {
		while (compareHands(hands[i], pivot) < 0) {
			i++;
		}
		while (compareHands(hands[j], pivot) > 0) {
			j--;
		}
		if (i <= j) {
			hands = swap(hands, i, j);
			i++;
			j--;
		}
	}

	return i;
}

/*
	a > b - return 1
	a = b - return 0
	a < b - return -1
*/
function compareHands(a: string, b: string): number {
	const aHand = a.split(' ')[0] ?? '';
	const bHand = b.split(' ')[0] ?? '';
	const difference = calculateHand(aHand) - calculateHand(bHand);

	if (difference === 0) {
		let i = 0;
		const aChars = aHand.split('');
		const bChars = bHand.split('');
		for (let i = 0; i < aHand.split('').length; i++) {
			if ((cardValue.get(aChars[i]) ?? 0) > (cardValue.get(bChars[i]) ?? 0))
				return 1;
			if ((cardValue.get(aChars[i]) ?? 0) < (cardValue.get(bChars[i]) ?? 0))
				return -1;
		}
		return 0;
	} else if (difference > 0) {
		return 1;
	} else {
		return -1;
	}
}

function calculateHand(hand: string): Hand {
	const cardMap = new Map<string, number>();
	hand.split('').forEach(c => {
		cardMap.set(c, (cardMap.get(c) ?? 0) + 1);
	});

	const handMap = new Map<number, number>([
		[1, 0],
		[2, 0],
		[3, 0],
		[4, 0],
		[5, 0]
	]);
	
	if (isJokerWild) {
		let maxValue = 0;
		let maxKey = '';
		// TODO: if we have jokers, replace the highest valued card
		const numJokers = cardMap.get('J') ?? 0;
		if (numJokers > 0) {
			console.log('Initial Map: ', cardMap)

			cardMap.forEach((value, key) => {
				if (key !== 'J' && value > maxValue || (value === maxValue && (cardValue.get(key) ?? 0) > (cardValue.get(maxKey) ?? 0))) {
					maxKey = key;
					maxValue = value;
				}
			});
	
			if(maxKey.length > 0) {
				cardMap.set(maxKey, maxValue + numJokers);
				cardMap.set('J', 0);
			}
			
			console.log('Joker augmented card map', cardMap)
		}
		
	}

	cardMap.forEach((value, key) => {
		handMap.set(value, (handMap.get(value) ?? 0) + 1);
	});

	if (handMap.get(5) === 1) {
		return Hand.FIVE_OF_A_KIND;
	} else if (handMap.get(4) === 1 && handMap.get(1) === 1) {
		return Hand.FOUR_OF_A_KIND;
	} else if (handMap.get(3) === 1 && handMap.get(2) === 1) {
		return Hand.FULL_HOUSE;
	} else if (handMap.get(3) === 1 && handMap.get(2) === 0) {
		return Hand.THREE_OF_A_KIND;
	} else if (handMap.get(2) === 2) {
		return Hand.TWO_PAIR;
	} else if (handMap.get(2) === 1 && handMap.get(1) == 3) {
		return Hand.PAIR;
	} else {
		return Hand.HIGH_CARD;
	}
}

// Swaps left and right index in hands array
function swap(hands: string[], leftIndex: number, rightIndex: number) {
	const temp = hands[leftIndex];
	hands[leftIndex] = hands[rightIndex];
	hands[rightIndex] = temp;
	return hands;
}

async function run() {
	const part1Tests: TestCase[] = [
		{
			input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
			solution: '6440',
		}
	];
	const part2Tests: TestCase[] = [
		{
			input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
			solution: '5905',
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
