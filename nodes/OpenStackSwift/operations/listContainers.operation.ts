import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

export const listContainersOperation = {
	name: 'listContainers',
	displayName: 'List Containers',
	action: 'List all containers',
	properties: [] as INodeProperties[],

	async execute(this: IExecuteFunctions, token: string, storageUrl: string, index: number): Promise<any> {
		const response = await this.helpers.httpRequest({
			method: 'GET',
			url: storageUrl,
			headers: { 'X-Auth-Token': token },
			ignoreHttpStatusErrors: false,
		});

		return Array.isArray(response) ? { containers: response } : { data: response };
	}
};
