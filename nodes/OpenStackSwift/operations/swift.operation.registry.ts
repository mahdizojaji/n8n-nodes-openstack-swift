import { SwiftOperation } from './swift.operation.base';

class OperationRegistry {
	private static operations = new Map<string, SwiftOperation>();

	static register(operation: SwiftOperation) {
		this.operations.set(operation.name, operation);
	}

	static get(name: string): SwiftOperation | undefined {
		return this.operations.get(name);
	}

	static getAll(): SwiftOperation[] {
		return Array.from(this.operations.values());
	}
}

export { OperationRegistry };
