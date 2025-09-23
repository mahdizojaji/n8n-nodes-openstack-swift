import {IExecuteFunctions, INodeProperties} from 'n8n-workflow';
import {SwiftOperation} from '../swift.operation.base';
import {OperationRegistry} from '../swift.operation.registry';

export class DeleteObjectOperation extends SwiftOperation {
	name = 'deleteObject';
	displayName = 'Delete Object';
	action = 'Delete an object from a container';
	properties: INodeProperties[] = [
		{
			displayName: 'Container Name',
			name: 'containerName',
			type: 'string' as const,
			default: '',
			required: true,
		},
		{
			displayName: 'Object Name',
			name: 'objectName',
			type: 'string',
			default: '',
			required: true,
		},
	];

	async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
		const container = this.getNodeParameter('containerName', index) as string;
		const objectName = this.getNodeParameter('objectName', index) as string;
		const url = `${storageUrl}/${container}/${objectName}`;
		const response = await this.helpers.httpRequest({
			method: 'DELETE',
			url,
			headers: {
				'X-Auth-Token': token,
			},
			ignoreHttpStatusErrors: false,
		});
		return {success: true, response};
	}
}

OperationRegistry.register(new DeleteObjectOperation());
