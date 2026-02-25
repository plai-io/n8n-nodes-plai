# n8n-nodes-plai

This is an n8n community node. It lets you use Plai in your n8n workflows.

Plai makes it easy to plan marketing campaigns, find insights in your analytics, and act on your insights with targeted ads across multiple platforms. This node allows you to receive leads from Meta (Facebook/Instagram), LinkedIn, and TikTok ads in real-time.

**New to Plai?** Sign up for a [7-day free trial](https://whitelabel.plai.io) to get started.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

- ✅ **Real-time lead capture**: Automatically receive leads the moment they're submitted
- ✅ **Meta, LinkedIn & TikTok support**: Connect all major advertising platforms  
- ✅ **Zero-code setup**: Configure in minutes without writing code
- ✅ **Reliable webhooks**: Never miss a lead with n8n's webhook infrastructure

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Install via GUI (n8n Cloud and Self-Hosted)

From n8n version 0.187.0 onwards, you can install community nodes from the n8n editor:

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-plai` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

### Manual Installation

To install the node locally, you must have npm (Node Package Manager) installed. Follow n8n's [npm installation guide](https://docs.n8n.io/hosting/installation/npm/).

1. In your n8n root directory, enter:
   ```bash
   npm install n8n-nodes-plai
   ```
2. Restart n8n.

For Docker-based installations, add the package to the mounted volume and restart the container. Refer to n8n's [manual installation guide](https://docs.n8n.io/integrations/community-nodes/installation/manual-installation/) for details.

## Operations

### Plai

The Plai action node is currently in development. Campaign management operations are coming soon.

**Current Status**: Use the **Plai Trigger** node to receive leads in real-time.

### Plai Trigger

**Webhook trigger for receiving leads in real-time**

- **Meta (Facebook/Instagram)**: Receive leads from Facebook and Instagram ad campaigns
- **LinkedIn**: Receive leads from LinkedIn ad campaigns
- **TikTok**: Receive leads from TikTok ad campaigns

## Credentials

This node uses API authentication to connect to Plai.

### Prerequisites

To use this node, you need a Plai account. If you don't have an account:

1. Visit [whitelabel.plai.io](https://whitelabel.plai.io) to sign up
2. Start your **7-day free trial** (no credit card required)
3. Once registered, you can generate API credentials from your dashboard

### Required Credentials

- **Client ID**: Your Plai User ID
- **Client Secret**: Your Plai API Key

### Getting Your API Credentials

1. Log in to your Plai account at [whitelabel.plai.io](https://whitelabel.plai.io)
2. Navigate to **Settings > API Keys**
3. Copy your **User ID** and **API Key**
4. In n8n credentials configuration:
   - Paste your User ID into the **Client ID** field
   - Paste your API Key into the **Client Secret** field

### Platform Connections

Before receiving leads via this node, ensure you have connected your advertising accounts in Plai:

- **For Meta (Facebook/Instagram) leads**: Connect your Meta Business account in your Plai dashboard
- **For LinkedIn leads**: Connect your LinkedIn Ads account in your Plai dashboard
- **For TikTok leads**: Connect your TikTok Ads account in your Plai dashboard

Refer to the Plai platform at [whitelabel.plai.io](https://whitelabel.plai.io) for instructions on connecting advertising accounts.

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested with**: n8n version 1.70.0+

## Usage

This node currently provides the **Plai Trigger** for receiving leads in real-time. The Plai action node for campaign management is coming soon.

### Plai Trigger (Available Now)

Use this node to trigger workflows when new leads are received from Meta, LinkedIn, or TikTok ads.

**Example: Receive Meta Leads**

1. Add the Plai Trigger node to your workflow
2. Select **Meta (Facebook/Instagram)** as the platform
3. Select the Facebook Page to monitor
4. Activate the workflow
5. New leads will automatically trigger the workflow

**Example: Receive LinkedIn Leads**

1. Add the Plai Trigger node to your workflow
2. Select **LinkedIn** as the platform
3. Activate the workflow
4. New leads will automatically trigger the workflow

**Example: Receive TikTok Leads**

1. Add the Plai Trigger node to your workflow
2. Select **TikTok** as the platform
3. Activate the workflow
4. New leads will automatically trigger the workflow

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Plai platform](https://whitelabel.plai.io)

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## License

[MIT](LICENSE.md)
