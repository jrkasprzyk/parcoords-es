# Releasing

How to publish a new version of `@jrkasprzyk/parcoord-es` to npm.

## Prerequisites

- Logged in to npm as `jrkasprzyk` (`npm whoami` to check, `npm login` if not)
- On `master` with a clean working tree (`npm version` refuses to run otherwise)
- All changes you want in the release are committed

## Steps

```sh
# 1. Bump the version (pick one). This updates package.json,
#    creates a commit, and creates a git tag (e.g. v3.0.1).
npm version patch    # bug fixes, doc-only changes (3.0.0 -> 3.0.1)
npm version minor    # new backwards-compatible features (3.0.0 -> 3.1.0)
npm version major    # breaking changes (3.0.0 -> 4.0.0)

# 2. Publish. The "prepare" script runs `npm test`, which via
#    "pretest" runs a fresh `npm run build` first — so dist/ is
#    rebuilt automatically before the tarball is created.
npm publish

# 3. Push the version commit and the tag to GitHub.
git push --follow-tags
```

## Verify

- https://www.npmjs.com/package/@jrkasprzyk/parcoord-es shows the new version
- `npm view @jrkasprzyk/parcoord-es version` returns the new version

## Notes

- **The npm page README is frozen at publish time.** npm renders the
  README that was inside the published tarball, not the one on GitHub.
  A README fix only appears on npmjs.com after the next publish.
- **A published version can never be overwritten.** Even after
  `npm unpublish`, the same version number is permanently blocked.
  Mistakes are fixed by publishing the next patch version.
- The package is scoped, so `publishConfig.access: "public"` in
  package.json is required and already set — no `--access public`
  flag needed.
- Only `src/` and `dist/` go into the tarball (the `files` field in
  package.json). Run `npm pack --dry-run` to preview the contents.
