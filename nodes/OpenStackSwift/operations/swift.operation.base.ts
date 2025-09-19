import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

export abstract class SwiftOperation {
	abstract name: string;
	abstract displayName: string;
	abstract action: string;
	abstract properties: INodeProperties[];

	abstract execute(
		this: IExecuteFunctions,
		token: string,
		storageUrl: string,
		index: number,
	): Promise<any>;
}
