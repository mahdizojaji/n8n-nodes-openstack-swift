import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { SwiftOperation } from '../swift.operation.base';
import { OperationRegistry } from '../swift.operation.registry';

export class CreateObjectOperation extends SwiftOperation {
    name = 'createObject';
    displayName = 'Create Object';
    action = 'Create an object in a container';
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
            displayName: 'Content',
            name: 'content',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Content Type',
            name: 'contentType',
            type: 'string',
            default: 'application/octet-stream'
        },
    ];

    async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
        const container = this.getNodeParameter('container', index) as string;
        const objectName = this.getNodeParameter('objectName', index) as string;
        const content = this.getNodeParameter('content', index) as string;
        const contentType = this.getNodeParameter('contentType', index) as string;
        const url = `${storageUrl}/${container}/${objectName}`;
        const response = await this.helpers.httpRequest({
            method: 'PUT',
            url,
            headers: {
                'X-Auth-Token': token,
                'Content-Type': contentType || 'application/octet-stream',
            },
            body: content,
            ignoreHttpStatusErrors: false,
        });
        return { success: true, response };
    }
}

OperationRegistry.register(new CreateObjectOperation());
