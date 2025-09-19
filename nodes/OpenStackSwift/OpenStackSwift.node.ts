import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { listContainers } from './operations/listContainers';
import { createContainer } from './operations/createContainer';

export class OpenStackSwift implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenStack Swift',
		name: 'openStackSwift',
		icon: 'file:swift.svg',
		group: ['output'],
		version: 1,
		subtitle: 'Interact with OpenStack Swift',
		description: 'Perform operations on OpenStack Swift storage',
		defaults: { name: 'OpenStack Swift' },
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [{ name: 'openStackSwiftApi', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'List Containers', value: 'listContainers', action: 'List all containers' },
					{ name: 'Create Container', value: 'createContainer', action: 'Create a new container' },
				],
				default: 'listContainers',
			},
			{
				displayName: 'Container Name',
				name: 'containerName',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createContainer'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const { authToken, storageUrl } = await this.getCredentials('openStackSwiftApi') as {
			authToken: string;
			storageUrl: string;
		};

		if (!authToken || !storageUrl) {
			throw new NodeOperationError(this.getNode(), 'Auth Token and Storage URL are required.');
		}

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let result: any;

				if (operation === 'listContainers') {
					result = await listContainers(this, authToken, storageUrl, i);
				} else if (operation === 'createContainer') {
					result = await createContainer(this, authToken, storageUrl, i);
				}

				returnData.push({ json: result, pairedItem: { item: i } });
			} catch (error) {
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
