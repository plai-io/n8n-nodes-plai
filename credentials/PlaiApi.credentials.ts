import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PlaiApi implements ICredentialType {
	name = 'plaiApi';

	displayName = 'Plai API';

	icon = 'file:plai.svg' as const;

	documentationUrl = 'https://github.com/plai-io/n8n-nodes-plai#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
			description: 'Your Plai User ID (found in Settings → API Keys)',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Plai API Key (found in Settings → API Keys)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.clientSecret}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://public.plai.io',
			url: '/n8n/account_verify',
			method: 'POST',
			body: {
				userId: '={{$credentials.clientId}}',
			},
		},
	};
}
