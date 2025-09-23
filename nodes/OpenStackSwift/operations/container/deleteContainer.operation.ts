import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { SwiftOperation } from '../swift.operation.base';
import { OperationRegistry } from '../swift.operation.registry';

export class DeleteContainerOperation extends SwiftOperation {
    name = 'deleteContainer';
    displayName = 'Delete Container';
    action = 'Delete a container';
    properties: INodeProperties[] = [
        {
            displayName: 'Container Name',
            name: 'container',
            type: 'string',
            default: '',
            required: true,
        },
    ];

    async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
        const container = this.getNodeParameter('container', index) as string;
        const url = `${storageUrl}/${container}`;
        const response = await this.helpers.httpRequest({
            method: 'DELETE',
            url,
            headers: {
                'X-Auth-Token': token,
            },
            ignoreHttpStatusErrors: false,
        });
        return { success: true, response };
    }
}

OperationRegistry.register(new DeleteContainerOperation());
