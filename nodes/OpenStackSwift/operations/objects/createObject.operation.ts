import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { SwiftOperation } from '../swift.operation.base';
import { OperationRegistry } from '../swift.operation.registry';

export class CreateObjectOperation extends SwiftOperation {
	name = 'createObject';
	displayName = 'Create Object';
	action = 'Create an object in a container';
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
			displayName: 'File Type',
			name: 'fileType',
			type: 'options',
			options: [
				{ name: 'Text', value: 'text' },
				{ name: 'Binary', value: 'binary' },
			],
			default: 'text',
			required: true,
		},
		{
			displayName: 'Content (Text)',
			name: 'contentText',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: { fileType: ['text'] },
			},
		},
		{
			displayName: 'Binary Property',
			name: 'binaryPropertyName',
			type: 'string',
			default: 'data',
			required: true,
			displayOptions: {
				show: { fileType: ['binary'] },
			},
			description: 'Name of the binary property containing the file data',
		},
		{
			displayName: 'Content Type',
			name: 'contentType',
			type: 'string',
			default: 'application/octet-stream',
		},
	];

	async execute(
		this: IExecuteFunctions,
		token: string,
		storageUrl: string,
		index: number
	): Promise<any> {
		const container = this.getNodeParameter('container', index) as string;
		const objectName = this.getNodeParameter('objectName', index) as string;
		const fileType = this.getNodeParameter('fileType', index) as string;
		const contentType = this.getNodeParameter('contentType', index) as string;
		const url = `${storageUrl}/${container}/${objectName}`;

		let body: any;

		if (fileType === 'text') {
			body = this.getNodeParameter('contentText', index) as string;
		} else if (fileType === 'binary') {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;

			// مسیر اول: دریافت مستقیم Buffer
			let binaryData = this.helpers.getBinaryDataBuffer(index, binaryPropertyName);

			// مسیر دوم: ساخت دستی Buffer از base64 اگر مسیر اول شکست خورد
			if (!Buffer.isBuffer(binaryData)) {
				const rawBinary = this.getInputData(index).binary?.[binaryPropertyName];
				if (!rawBinary) {
					throw new Error(`Binary property "${binaryPropertyName}" not found in input`);
				}
				binaryData = Buffer.from(rawBinary.data, 'base64');
			}
			body = binaryData;
		} else {
			throw new Error(`Unsupported fileType: ${fileType}`);
		}

		const response = await this.helpers.httpRequest({
			method: 'PUT',
			url,
			headers: {
				'X-Auth-Token': token,
				'Content-Type': contentType || 'application/octet-stream',
			},
			body,
			ignoreHttpStatusErrors: false,
		});

		return { success: true, response };
	}
}

OperationRegistry.register(new CreateObjectOperation());
