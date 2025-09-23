import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { SwiftOperation } from './swift.operation.base';
import { OperationRegistry } from './swift.operation.registry';

export class ListObjectsOperation extends SwiftOperation {
    name = 'listObjects';
    displayName = 'List Objects';
    action = 'List all objects in a container';
    properties: INodeProperties[] = [
        {
            displayName: 'Container Name',
            name: 'containerName',
			type: 'string' as const,
            default: '',
            required: true,
            displayOptions: {
				show: { operation: ['createContainer'] },
			},
        },
    ];

    async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
        const container = this.getNodeParameter('containerName', index) as string;
        const url = `${storageUrl}/${container}`;
        const response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers: {
                'X-Auth-Token': token,
                'Accept': 'application/json',
            },
            ignoreHttpStatusErrors: false,
        });
        return Array.isArray(response) ? { objects: response } : { data: response };
    }
}

OperationRegistry.register(new ListObjectsOperation());
