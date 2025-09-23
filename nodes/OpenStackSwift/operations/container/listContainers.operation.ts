import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { SwiftOperation } from '../swift.operation.base';
import { OperationRegistry } from '../swift.operation.registry';


export class ListContainersOperation extends SwiftOperation {
	name = 'listContainers';
	displayName = 'List Containers';
	action = 'List all containers';
	group = 'container';
	properties: INodeProperties[] = [];

	async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
		const response = await this.helpers.httpRequest({
			method: 'GET',
			url: storageUrl,
			headers: {
				'X-Auth-Token': token,
				"Accept": "application/json",
			},
			ignoreHttpStatusErrors: false,
		});

		return Array.isArray(response) ? { containers: response } : { data: response };
	}
}


OperationRegistry.register(new ListContainersOperation());
