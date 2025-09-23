import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { SwiftOperation } from '../swift.operation.base';
import { OperationRegistry } from '../swift.operation.registry';

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
			required: true,
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
			headers: {
				'X-Auth-Token': token,
				'Accept': 'application/json',
			},
			ignoreHttpStatusErrors: false,
			returnFullResponse: true,
		});

		let bodyAsJson: any = null;
		try {
			if (typeof response.body === 'string' && response.headers['content-type']?.includes('application/json')) {
				bodyAsJson = JSON.parse(response.body);
			} else if (typeof response.body === 'object') {
				bodyAsJson = response.body;
			}
		} catch (e) {
		}

		const statusCode = response.statusCode || response.status?.code;
		const success = statusCode === 201;

		return {
			success: success,
			statusCode: statusCode,
			container: containerName,
			requestId: response.headers['x-openstack-request-id'] || null,
			transactionId: response.headers['x-trans-id'] || null,
			response: response.body,
			responseJson: bodyAsJson,
		};
	}
}

OperationRegistry.register(new CreateContainerOperation());
