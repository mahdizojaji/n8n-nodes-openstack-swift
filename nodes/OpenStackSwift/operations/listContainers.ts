import { IExecuteFunctions } from 'n8n-workflow';

export async function listContainers(
	executeFns: IExecuteFunctions,
	token: string,
	storageUrl: string,
	index: number,
) {
	const response = await executeFns.helpers.httpRequest({
		method: 'GET',
		url: storageUrl,
		headers: { 'X-Auth-Token': token },
		ignoreHttpStatusErrors: false,
	});

	return Array.isArray(response) ? { containers: response } : { data: response };
}
