import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Plai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Plai',
		name: 'plai',
		icon: 'file:plai.svg',
		group: ['transform'],
		version: 1,
		subtitle: 'Coming Soon',
		description: 'Consume Plai API',
		defaults: {
			name: 'Plai',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'plaiApi',
				required: true,
			},
		],
		documentationUrl: 'https://github.com/plai-io/n8n-nodes-plai#operations',
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
				],
				default: 'campaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: [
					{
						name: 'Create (Coming Soon)',
						value: 'create',
						action: 'Create a campaign (Coming Soon)',
						description: 'Create a new campaign (Coming Soon)',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Coming Soon',
				name: 'notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'Campaign creation is being developed. Use &lt;strong&gt;Plai Trigger&lt;/strong&gt; to receive leads in real-time.',
			},
		],
		usableAsTool: true,
	};
}
