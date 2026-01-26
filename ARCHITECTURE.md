# Plai n8n Nodes - Architecture Overview

## Node Structure

```mermaid
graph TB
    subgraph n8nUI["n8n Node Palette"]
        PlaiNode["📦 Plai<br/>(Actions)"]
        PlaiTriggerNode["⚡ Plai Trigger<br/>(Webhooks)"]
    end
    
    subgraph PlaiActions["Plai Node (plai)"]
        GetLead["Get Lead<br/>by ID"]
        FutureOps["Future:<br/>List Leads<br/>Update Lead<br/>Get Campaign"]
    end
    
    subgraph PlaiTriggers["Plai Trigger (plaiTrigger)"]
        MetaTrigger["Meta Leads<br/>(Facebook/Instagram)"]
        LinkedInTrigger["LinkedIn Leads"]
    end
    
    subgraph PlaiBackend["Plai Backend APIs"]
        AccountVerify["/n8n/account_verify"]
        LeadsPages["/n8n/leads_pages"]
        WebhooksSubscribe["/n8n/webhooks_subscribe"]
        WebhooksUnsubscribe["/n8n/webhooks_unsubscribe"]
        GetLeadAPI["/n8n/leads/:leadId"]
    end
    
    PlaiNode --> PlaiActions
    PlaiTriggerNode --> PlaiTriggers
    
    GetLead -->|GET| GetLeadAPI
    MetaTrigger -->|POST| LeadsPages
    MetaTrigger -->|POST| WebhooksSubscribe
    MetaTrigger -->|POST| WebhooksUnsubscribe
    LinkedInTrigger -->|POST| WebhooksSubscribe
    LinkedInTrigger -->|POST| WebhooksUnsubscribe
    
    AccountVerify -.->|Used by| PlaiCredentials["PlaiApi Credentials"]
    
    style PlaiNode fill:#2563EB,color:#fff
    style PlaiTriggerNode fill:#2563EB,color:#fff
    style GetLead fill:#10b981,color:#fff
    style MetaTrigger fill:#f59e0b,color:#fff
    style LinkedInTrigger fill:#f59e0b,color:#fff
```

## Data Flow

### 1. Plai Trigger (Real-time Webhooks)

```mermaid
sequenceDiagram
    participant User as n8n User
    participant N8N as n8n Workflow
    participant PlaiTrigger as Plai Trigger Node
    participant PlaiAPI as Plai Backend
    participant Meta as Meta/LinkedIn
    
    User->>N8N: Activate workflow
    N8N->>PlaiTrigger: Create webhook
    PlaiTrigger->>PlaiAPI: POST /n8n/webhooks_subscribe
    PlaiAPI->>Meta: Subscribe to lead events
    Meta-->>PlaiAPI: Subscription confirmed
    PlaiAPI-->>PlaiTrigger: subscriptionId
    PlaiTrigger-->>N8N: Webhook ready
    
    rect rgb(200, 255, 200)
        Note over Meta,N8N: Lead Generation Flow
        Meta->>PlaiAPI: New lead submitted
        PlaiAPI->>PlaiAPI: Process & enrich lead
        PlaiAPI->>N8N: POST to webhook URL
        N8N->>PlaiTrigger: Receive lead data
        PlaiTrigger->>N8N: Trigger workflow execution
    end
    
    User->>N8N: Deactivate workflow
    N8N->>PlaiTrigger: Delete webhook
    PlaiTrigger->>PlaiAPI: POST /n8n/webhooks_unsubscribe
    PlaiAPI->>Meta: Unsubscribe from events
```

### 2. Plai Action Node (Get Lead)

```mermaid
sequenceDiagram
    participant Workflow as n8n Workflow
    participant PlaiNode as Plai Node
    participant PlaiAPI as Plai Backend
    participant DB as Plai Database
    
    Workflow->>PlaiNode: Execute with leadId
    PlaiNode->>PlaiAPI: GET /n8n/leads/:leadId
    PlaiAPI->>DB: Query lead data
    DB-->>PlaiAPI: Lead record
    PlaiAPI-->>PlaiNode: Lead data (JSON)
    PlaiNode-->>Workflow: Return lead object
```

## File Structure

```
n8n-nodes-plai/
│
├── credentials/
│   ├── PlaiApi.credentials.ts      # x-api-key authentication
│   └── plai.svg                    # Logo
│
├── nodes/Plai/
│   ├── Plai.node.ts                # Main action node
│   │   └── Resource: Lead
│   │       └── Operation: Get Lead
│   │
│   ├── PlaiTrigger.node.ts         # Webhook trigger node
│   │   ├── Platform: Meta
│   │   │   └── Dynamic page selection
│   │   └── Platform: LinkedIn
│   │
│   ├── Plai.node.json              # Codex metadata
│   ├── PlaiTrigger.node.json       # Codex metadata
│   └── plai.svg                    # Logo
│
├── package.json                    # Registers both nodes
│   └── n8n.nodes:
│       ├── dist/nodes/Plai/Plai.node.js
│       └── dist/nodes/Plai/PlaiTrigger.node.js
│
└── README.md                       # Documentation
```

## Lead Data Structure

```json
{
  "leadId": "string",
  "source": "meta_lead_ads | linkedin_lead_ads",
  "name": "string",
  "email": "string",
  "phone": "string",
  "customFields": {
    "company": "string",
    "job_title": "string",
    "...": "..."
  },
  "pageId": "string (Meta only)",
  "adAccountId": "string (LinkedIn only)",
  "campaignId": "string",
  "adsetId": "string",
  "adId": "string",
  "formId": "string",
  "createdTime": "ISO 8601",
  "receivedAt": "ISO 8601",
  "agencyId": "string",
  "workspaceId": "string",
  "userId": "string",
  "clientId": "string"
}
```

## Example Workflows

### Workflow 1: Real-time Lead to CRM

```
[Plai Trigger: Meta Leads]
    ↓
[IF: Email exists?]
    ↓ Yes
[HubSpot: Create/Update Contact]
    ↓
[Slack: Notify #sales]
```

### Workflow 2: Daily Lead Report

```
[Schedule: Daily 9 AM]
    ↓
[Set: Lead IDs array]
    ↓
[Loop through IDs]
    ↓
[Plai: Get Lead]
    ↓
[Aggregate leads]
    ↓
[Gmail: Send report]
```

### Workflow 3: Lead Enrichment

```
[Plai Trigger: LinkedIn Leads]
    ↓
[Plai: Get Lead] (get full details)
    ↓
[Clearbit: Enrich contact]
    ↓
[Salesforce: Create lead]
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User as User
    participant N8N as n8n
    participant Creds as PlaiApi Credentials
    participant API as Plai Backend
    
    User->>N8N: Configure credentials
    User->>Creds: Enter API Key + User ID
    Creds->>API: POST /n8n/account_verify
    Note over Creds,API: Headers: x-api-key<br/>Body: {userId}
    
    alt Valid credentials
        API-->>Creds: {success: true}
        Creds-->>N8N: ✅ Credentials valid
        N8N-->>User: Ready to use
    else Invalid credentials
        API-->>Creds: {success: false, error}
        Creds-->>N8N: ❌ Test failed
        N8N-->>User: Show error message
    end
```

## Error Handling

Both nodes implement comprehensive error handling:

1. **User-Friendly Messages**
   - "No Meta account connected" → Shows steps to connect in Plai
   - "Please select a page" → Clear validation message
   - API errors parsed and displayed with context

2. **Graceful Degradation**
   - Empty page dropdown shows helpful placeholder
   - Failed webhook deletion doesn't break deactivation
   - `continueOnFail` support in Plai node

3. **Developer Context**
   - All errors include `itemIndex` for debugging
   - Nested error responses are automatically parsed
   - Failed operations show in execution logs with full stack

## Future Enhancements

### Plai Node (Actions)
- [ ] List Leads (with pagination and filters)
- [ ] Update Lead (add notes, tags, status)
- [ ] Get Campaign (campaign details)
- [ ] List Campaigns (with filters)
- [ ] Get Ad Performance (metrics)
- [ ] Create Campaign (if API supports)

### Plai Trigger Node
- ✅ Meta leads webhook (complete)
- ✅ LinkedIn leads webhook (complete)
- [ ] Campaign status changes (if requested)
- [ ] Budget alerts (if requested)

---

**Built with ❤️ using n8n node development best practices**
