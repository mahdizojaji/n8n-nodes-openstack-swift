import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { SwiftOperation } from '../swift.operation.base';
import { OperationRegistry } from '../swift.operation.registry';

export class GetObjectOperation extends SwiftOperation {
	name = 'getObject';
	displayName = 'Get Object';
	action = 'Get an object from a container';
	group = 'object';

	properties: INodeProperties[] = [
		{
			displayName: 'Container Name',
			name: 'container',
			type: 'string',
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
		{
			displayName: 'Output Binary Property Name',
			name: 'outputBinaryPropertyName',
			type: 'string',
			default: 'data',
			description: 'Name of the binary property in the output item',
		},
	];

	async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
		const container = this.getNodeParameter('container', index) as string;
		const objectName = this.getNodeParameter('objectName', index) as string;
		const outputBinaryPropertyName = this.getNodeParameter('outputBinaryPropertyName', index) as string;

		const url = `${storageUrl}/${container}/${objectName}`;

		try {
			const response = await this.helpers.httpRequest({
				method: 'GET',
				url,
				headers: {
					'X-Auth-Token': token,
				},
				ignoreHttpStatusErrors: false,
				encoding: 'arraybuffer',
				returnFullResponse: true,
			});

			if (!response || !response.body) {
				throw new Error(`Object "${objectName}" not found in container "${container}"`);
			}

			const mimeType = response.headers['content-type'] || 'application/octet-stream';
			const base64Data = Buffer.from(response.body as Buffer).toString('base64');

			return [
				{
					json: {},
					binary: {
						[outputBinaryPropertyName]: {
							data: base64Data,
							fileName: objectName,
							mimeType,
						},
					},
				},
			];

		} catch (error) {
			throw new Error(`Failed to fetch object "${objectName}": ${error.message}`);
		}
	}
}

OperationRegistry.register(new GetObjectOperation());
