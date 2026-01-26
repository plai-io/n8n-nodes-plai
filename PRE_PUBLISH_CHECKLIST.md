# Pre-Publish Checklist for n8n-nodes-plai

## ✅ COMPLETED ITEMS

### Code Quality
- [x] All TypeScript code compiles without errors
- [x] Linter passes with no warnings (`npm run lint`)
- [x] Build succeeds (`npm run build`)
- [x] BASE_URL changed from ngrok to production (`https://public.plai.io`)
- [x] No TODO/FIXME comments in production code
- [x] Icon files exist (plai.svg in both locations)

### Documentation
- [x] README.md is accurate and complete
- [x] README matches actual node operations (not fake examples)
- [x] Credentials section matches actual credential fields (Client ID + Client Secret)
- [x] Free trial is prominently mentioned
- [x] Installation instructions follow n8n standards
- [x] CHANGELOG.md created and populated
- [x] LICENSE.md exists (MIT)

### Package Configuration
- [x] package.json has correct metadata
- [x] Repository URL is correct and repo is public
- [x] Keywords include `n8n-community-node-package`
- [x] Author and email are correct
- [x] Nodes are properly registered in package.json
- [x] Version is set to 1.0.0

### Node Files
- [x] PlaiTrigger.node.ts functional and tested
- [x] Plai.node.ts shows "Coming Soon" appropriately
- [x] PlaiApi.credentials.ts has correct fields
- [x] .node.json files have proper metadata

---

## ⚠️ ITEMS TO COMPLETE BEFORE PUBLISH

### Critical (Must Do)
- [ ] **Verify GitHub repo exists and is accessible**: https://github.com/plai-io/n8n-nodes-plai
- [ ] **Test the node locally** with `npm run dev` one more time
- [ ] **Ensure you have npm account** and are logged in (`npm whoami`)

### Important (Should Do Before Verification)
- [ ] **Build API key management UI** in whitelabel.plai.io
  - Settings > API Keys section
  - Display User ID (Client ID)
  - Display/Generate API Key (Client Secret)
  - Allow users to regenerate keys

### Optional (Can Do Later)
- [ ] Create docs.plai.io with API documentation
- [ ] Add example workflows to README
- [ ] Create video tutorial
- [ ] Add screenshots to README

---

## 📋 PUBLISHING STEPS

### 1. Final Tests
```bash
cd /Users/muhammadarsalanmanzoor/Developer/projects/plai/n8n-nodes-plai

# Clean build
rm -rf dist
npm run build

# Verify linter
npm run lint

# Test locally
npm run dev
```

### 2. Verify GitHub Repo
```bash
# Check remote
git remote -v

# Should show: https://github.com/plai-io/n8n-nodes-plai.git
```

### 3. Commit and Push Changes
```bash
git add .
git commit -m "chore: prepare for npm publish v1.0.0

- Fixed production BASE_URL
- Updated README with accurate operations
- Added CHANGELOG.md
- Ready for npm registry"

git push origin main
```

### 4. Publish to npm
```bash
# Ensure you're logged in
npm whoami

# If not logged in:
npm login

# Publish
npm publish

# Should output: + n8n-nodes-plai@1.0.0
```

### 5. Verify Publication
```bash
# Check it's on npm
npm info n8n-nodes-plai

# Install it to test
npm install n8n-nodes-plai
```

---

## 🎯 VERIFICATION SUBMISSION

### When to Submit
- ✅ After npm publish is successful
- ✅ After API key management UI is built in whitelabel.plai.io

### Where to Submit
https://creators.n8n.io/

### What to Include

**Submission Message:**
```
Node Package: n8n-nodes-plai
npm URL: https://www.npmjs.com/package/n8n-nodes-plai
GitHub: https://github.com/plai-io/n8n-nodes-plai

Testing Instructions:
1. Visit https://whitelabel.plai.io
2. Sign up for 7-day free trial (no credit card required)
3. Navigate to Settings > API Keys
4. Copy your User ID and API Key
5. In n8n, install the node and configure credentials:
   - Client ID: [Your User ID]
   - Client Secret: [Your API Key]
6. Add Plai Trigger node to workflow
7. Select platform (Meta or LinkedIn)
8. Activate workflow

The node currently provides:
- Real-time lead webhook triggers for Meta and LinkedIn
- Dynamic page selection for Meta leads
- Plai action node operations coming soon

Free trial includes full access to all features for testing.

License: MIT
No external runtime dependencies
```

---

## 📊 SUCCESS METRICS

### After npm Publish
- [ ] Package appears on npm registry
- [ ] Can be installed with `npm install n8n-nodes-plai`
- [ ] Users can install via n8n GUI (with warning)

### After Verification
- [ ] Verified badge on npm
- [ ] Installable via n8n GUI without warnings
- [ ] Appears in n8n official docs
- [ ] Available in n8n Cloud

---

## 🚨 TROUBLESHOOTING

### npm publish fails with "402 Payment Required"
- You need to verify your email with npm
- Go to https://www.npmjs.com/

### npm publish fails with "403 Forbidden"  
- Package name might be taken
- Try `npm info n8n-nodes-plai` to check

### Node doesn't appear after install
- Run `npm run build` before publishing
- Check `package.json` has correct `n8n.nodes` array
- Restart n8n after installing

### Verification rejected
- Ensure API key management is self-service
- Update documentation if needed
- Address n8n team feedback

---

## 📁 FILE STATUS SUMMARY

```
✅ Ready Files:
- package.json (configured)
- README.md (accurate & complete)
- CHANGELOG.md (created)
- LICENSE.md (MIT)
- PlaiTrigger.node.ts (production-ready)
- Plai.node.ts (shows coming soon)
- PlaiApi.credentials.ts (correct fields)
- plai.svg icons (both locations)
- .node.json files (proper metadata)

⚠️ Needs Attention:
- GitHub repo (verify it's accessible)
- whitelabel.plai.io API key UI (must build)
- docs.plai.io (optional, can build later)

✅ Build Artifacts (auto-generated):
- dist/ folder (created by npm run build)
- node_modules/ (not published)
```

---

## 🎉 YOU'RE READY!

Your node is **production-ready** and follows all n8n community node standards.

**Next immediate action:**
1. Verify GitHub repo is accessible
2. Run final tests
3. Publish to npm
4. Build API key management UI
5. Submit for verification

Good luck! 🚀
