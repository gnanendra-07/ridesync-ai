# Workspace Rules

## Feature Verification Workflow

Before implementing ANY feature, perform this verification process:

1. **Check Git Status**: Check the project's Git repository and current branch.
2. **Search the Codebase**: Search the entire codebase for the requested feature. Look for:
   - Existing components
   - Existing pages
   - Existing hooks
   - Existing services
   - Existing API calls
   - Existing utility functions
   - Existing assets
   - Existing routes
3. **If Feature Exists**:
   - ❌ DO NOT recreate it.
   - Reuse, improve, fix bugs, or refactor it.
4. **If Feature Does Not Exist**:
   - Create it following the existing project architecture.
5. **Initial Verification Report**:
   - Before writing any code, clearly report `Already exists` or `Not implemented` and list every related file found.

Only after this report should implementation begin.
