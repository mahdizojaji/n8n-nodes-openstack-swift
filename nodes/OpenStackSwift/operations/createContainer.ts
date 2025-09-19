import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

export async function createContainer(
	executeFns: IExecuteFunctions,
	token: string,
	storageUrl: string,
	index: number,
) {
	const containerName = executeFns.getNodeParameter('containerName', index) as string;

	if (!containerName) {
		throw new NodeOperationError(
			executeFns.getNode(),
			'Container name is required',
			{ itemIndex: index },
		);
	}

	const url = `${storageUrl}/${encodeURIComponent(containerName)}`;

	const response = await executeFns.helpers.httpRequest({
		method: 'PUT',
		url,
		headers: { 'X-Auth-Token': token },
		ignoreHttpStatusErrors: false,
	});

	return { success: true, container: containerName, response };
}
