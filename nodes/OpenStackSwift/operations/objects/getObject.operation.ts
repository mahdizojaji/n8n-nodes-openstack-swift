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
    ];

    async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
        const container = this.getNodeParameter('container', index) as string;
        const objectName = this.getNodeParameter('objectName', index) as string;
        const url = `${storageUrl}/${container}/${objectName}`;
        const response = await this.helpers.httpRequest({
            method: 'GET',
            url,
            headers: {
                'X-Auth-Token': token,
            },
            ignoreHttpStatusErrors: false,
            encoding: 'arraybuffer',
        });
        return { object: response };
    }
}

OperationRegistry.register(new GetObjectOperation());
