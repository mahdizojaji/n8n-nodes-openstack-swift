import type { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class OpenStackSwiftApi implements ICredentialType {
	name = 'openStackSwiftApi';
	displayName = 'OpenStack Swift API';
	documentationUrl = 'https://docs.openstack.org/api-ref/object-store/';
	icon: Icon = { light: 'file:swift.svg', dark: 'file:swift.svg' };
	properties: INodeProperties[] = [
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			placeholder: 'auth token'
		},
		{
			displayName: 'Storage URL',
			name: 'storageUrl',
			type: 'string',
			default: '',
			placeholder: 'storage url'
		}
	];
}
