import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const BASE_URL = 'https://public.plai.io';


export class PlaiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Plai Trigger',
		name: 'plaiTrigger',
		icon: 'file:plai.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Trigger workflow when a new lead is received from Meta or LinkedIn via Plai',
		defaults: {
			name: 'Plai Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [{ name: 'plaiApi', required: true }],
		documentationUrl: 'https://github.com/plai-io/n8n-nodes-plai#usage',
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'This trigger automatically registers a webhook with Plai when activated. Ensure your advertising accounts are connected in <a href="https://whitelabel.plai.io" target="_blank">your Plai dashboard</a>. <a href="https://github.com/plai-io/n8n-nodes-plai#credentials" target="_blank">More info</a>.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'On New Lead',
						value: 'newLead',
						description: 'Triggers when a new lead is submitted',
					},
				],
				default: 'newLead',
				required: true,
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Meta (Facebook/Instagram)',
						value: 'meta',
					},
					{
						name: 'LinkedIn',
						value: 'linkedin',
					},
				],
				default: 'meta',
				required: true,
			},
			{
				displayName: 'Page Name or ID',
				name: 'pageId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPages',
				},
				required: true,
				default: '',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				displayOptions: {
					show: {
						platform: ['meta'],
					},
				},
			},
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getPages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('plaiApi');
				const userId = credentials.clientId as string;
				const apiKey = credentials.clientSecret as string;
				const returnData: INodePropertyOptions[] = [];

				try {
					const response = await this.helpers.httpRequest({
						method: 'POST',
						url: `${BASE_URL}/n8n/leads_pages`,
						headers: {
							'x-api-key': apiKey,
							'Content-Type': 'application/json',
						},
						body: {
							userId,
						},
						json: true,
					});

					if (response.success && response.results?.success && response.results?.pages) {
						for (const page of response.results.pages) {
							returnData.push({
								name: page.name as string,
								value: page.id as string,
							});
						}
					}
				} catch {
					// Error loading pages - return empty array
				}

				// Add placeholder if no pages found
				if (returnData.length === 0) {
					returnData.push({
						name: '-- No pages found --',
						value: 'none',
					});
				}

				return returnData;
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				return webhookData.subscriptionId !== undefined;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials('plaiApi');
				const userId = credentials.clientId as string;
				const apiKey = credentials.clientSecret as string;
				const webhookUrl = this.getNodeWebhookUrl('default');
				const pageId = this.getNodeParameter('pageId', '') as string;
				const platform = this.getNodeParameter('platform', 'meta') as string;

				let response;
				try {
					response = await this.helpers.httpRequest({
						method: 'POST',
						url: `${BASE_URL}/n8n/webhooks_subscribe`,
						headers: {
							'x-api-key': apiKey,
							'Content-Type': 'application/json',
						},
						body: {
							userId,
							webhookUrl,
							pageId,
							platform,
						},
						json: true,
					});
				} catch (error: unknown) {
					// Parse error response if available
					const err = error as { message?: string };
					const message = err.message || '';

					// Find JSON in message (handles nested braces)
					const jsonStart = message.indexOf('{');
					const jsonEnd = message.lastIndexOf('}');

					if (jsonStart !== -1 && jsonEnd > jsonStart) {
						try {
							const jsonStr = message.substring(jsonStart, jsonEnd + 1);
							const parsed = JSON.parse(jsonStr) as { results?: { error?: string } };
							if (parsed.results?.error) {
								throw new NodeOperationError(this.getNode(), parsed.results.error);
							}
						} catch (parseErr) {
							// If it's already an Error we're rethrowing, rethrow it
							if (parseErr instanceof Error && parseErr.message !== message) {
								throw parseErr;
							}
						}
					}
					throw new NodeOperationError(this.getNode(), message || 'Failed to subscribe to leads');
				}

				// Check for success
				if (response.success && response.results?.success && response.results?.subscriptionId) {
					const webhookData = this.getWorkflowStaticData('node');
					webhookData.subscriptionId = response.results.subscriptionId;
					return true;
				}

				// Throw error with message from backend
				const errorMessage = response.results?.error || 'Failed to subscribe to leads';
				throw new NodeOperationError(this.getNode(), errorMessage);
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials('plaiApi');
				const userId = credentials.clientId as string;
				const apiKey = credentials.clientSecret as string;
				const webhookData = this.getWorkflowStaticData('node');
				const subscriptionId = webhookData.subscriptionId as string;
				const platform = this.getNodeParameter('platform', 'meta') as string;

				if (!subscriptionId) {
					return true;
				}

				try {
					await this.helpers.httpRequest({
						method: 'POST',
						url: `${BASE_URL}/n8n/webhooks_unsubscribe`,
						headers: {
							'x-api-key': apiKey,
							'Content-Type': 'application/json',
						},
						body: {
							userId,
							subscriptionId,
							platform,
						},
						json: true,
					});

					delete webhookData.subscriptionId;
					return true;
				} catch {
					return false;
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		// Return the lead data to the workflow
		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
