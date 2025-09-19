import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { SwiftOperation } from './swift.operation.base';
import { OperationRegistry } from './swift.operation.registry';


export class CreateContainerOperation extends SwiftOperation {
	name = 'createContainer';
	displayName = 'Create Container';
	action = 'Create a new container';
	properties: INodeProperties[] = [
		{
			displayName: 'Container Name',
			name: 'containerName',
			type: 'string' as const,
			default: '',
			displayOptions: {
				show: { operation: ['createContainer'] },
			},
		},
	];

	async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
		const containerName = this.getNodeParameter('containerName', index) as string;

		if (!containerName) {
			throw new NodeOperationError(
				this.getNode(),
				'Container name is required',
				{ itemIndex: index },
			);
		}

		const url = `${storageUrl}/${encodeURIComponent(containerName)}`;

		const response = await this.helpers.httpRequest({
			method: 'PUT',
			url,
			headers: { 'X-Auth-Token': token },
			ignoreHttpStatusErrors: false,
		});

		return { success: true, container: containerName, response };
	}
}

OperationRegistry.register(new CreateContainerOperation());
