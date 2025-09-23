import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';
import { OperationRegistry } from './operations/swift.operation.registry';

import './operations/createContainer.operation';
import './operations/listContainers.operation';
import './operations/listObjects.operation';
import './operations/deleteObject.operation';


export class OpenStackSwift implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenStack Swift',
		name: 'openStackSwift',
		icon: "file:swift.svg",
		group: ['transform'],
		version: 1,
		description: 'Interact with OpenStack Swift',
		subtitle: '={{ $parameter["operation"] }}',
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
				options: OperationRegistry.getAll().map(op => ({
					name: op.displayName,
					value: op.name,
					action: op.action,
				})),
				default: OperationRegistry.getAll()[0].name,
			},
			{
				displayName: 'Container Name',
				name: 'containerName',
				type: 'string' as const,
				default: '',
				required: true,
				displayOptions: {
					show: { operation: ['createContainer', 'listObjects'] },
				},
			},
			...OperationRegistry.getAll().flatMap(op => op.properties || []),
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('openStackSwiftApi') as {
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
			const operation = OperationRegistry.get(operationName);

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
