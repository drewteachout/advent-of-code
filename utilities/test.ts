export type TestCase = {
	input: string;
	solution: string;
	args?: any[];
}

export function logTestResult(testCase: TestCase, solution: string): void {
	if (testCase.solution === solution) {
		console.log('SUCCESS\n');
		console.log(`Solution: ${solution}\n`)
	}
	else {
		console.log('FAILED\n');
		console.log(`Expected: ${testCase.solution}`);
		console.log(`Actual: ${solution}\n`);
	}
}