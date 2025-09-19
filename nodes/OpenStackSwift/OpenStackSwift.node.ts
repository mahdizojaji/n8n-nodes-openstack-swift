import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { createContainerOperation } from './operations/createContainer.operation';
import { listContainersOperation } from './operations/listContainers.operation';

interface OperationDefinition {
	name: string;
	displayName: string;
	action: string;
	properties: INodeProperties[];
	execute(
		this: IExecuteFunctions,
		token: string,
		storageUrl: string,
		index: number,
	): Promise<any>;
}

const operations: OperationDefinition[] = [
	listContainersOperation,
	createContainerOperation,
];

export class OpenStackSwift implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenStack Swift',
		name: 'openStackSwift',
		icon: "file:swift.svg",
		group: ['transform'],
		version: 1,
		description: 'Interact with OpenStack Swift',
		subtitle: '={{ $parameter["operation"] }}', // ✅ fix subtitle lint
		defaults: { name: 'OpenStack Swift' },
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [{ name: 'openStackSwiftApi', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options' as const,
				noDataExpression: true,
				options: operations.map((op) => ({
					name: op.displayName,
					value: op.name,
					action: op.action,
				})),
				default: operations[0].name,
			},
			...operations.flatMap((op) => op.properties || []),
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = (await this.getCredentials('openStackSwiftApi')) as {
			authToken?: string;
			storageUrl?: string;
		};

		const { authToken, storageUrl } = credentials;

		if (!authToken || !storageUrl) {
			throw new NodeOperationError(
				this.getNode(),
				'Missing OpenStack Swift credentials (authToken or storageUrl)',
			);
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operationName = this.getNodeParameter('operation', i) as string;
			const operation = operations.find((op) => op.name === operationName);

			if (!operation) {
				throw new NodeOperationError(
					this.getNode(),
					`Operation "${operationName}" not found`,
				);
			}

			const result = await operation.execute.call(
				this,
				authToken,
				storageUrl,
				i,
			);

			returnData.push({ json: result });
		}

		return [returnData];
	}
}
