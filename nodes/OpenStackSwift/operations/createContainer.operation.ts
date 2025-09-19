import { IExecuteFunctions, INodeProperties, NodeOperationError } from 'n8n-workflow';

export const createContainerOperation = {
	name: 'createContainer',
	displayName: 'Create Container',
	action: 'Create a new container',
	properties: [
		{
			displayName: 'Container Name',
			name: 'containerName',
			type: 'string' as const,
			default: '',
			displayOptions: {
				show: { operation: ['createContainer'] },
			},
		},
	] as INodeProperties[],

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
};
