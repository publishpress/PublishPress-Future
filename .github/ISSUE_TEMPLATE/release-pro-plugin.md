---
name: Release the Pro Version (Team Only)
about: Default checklist for the plugin's release process.
title: Release PublishPress Future Pro v[VERSION]
labels: release
assignees: ''
---

To release the Pro plugin, ensure you complete all the tasks below.

### Pre-release Checklist

- [ ] Create the release branch as `release-<version>` from the development branch.
- [ ] Review and merge all relevant Pull Requests into the release branch.
- [ ] Update the version number to a beta version in the main plugin file as per [tech documentation](https://rambleventures.slab.com/posts/version-numbers-58nmrk4b), and commit to the release branch.
- [ ] Verify the correct version of the free plugin is referenced in the `lib/composer.json` file. Prefer stable versions.
- [ ] Start a dev-workspace session.
- [ ] Run `composer update` (updating root and lib vendors).
- [ ] Review updated packages and mention any production library updates in the changelog.
- [ ] Check if all dependencies are synced from Free into the Pro plugin with `composer check:deps`. If required, merge dependencies using `composer fix:deps` and run `composer update` again.
- [ ] Check if the free plugin uses Composer's autoload and copy the autoload definition from the free plugin to the pro plugin refactoring the relative paths, on `/lib/composer.json`. Execute `composer dumpautoload` to update the autoload files. Commit the changes.
- [ ] Inspect GitHub’s Dependabot warnings or Pull Requests. Resolve any false positives, then fix and commit the remaining issues.
- [ ] If needed, build JS files for production using `composer build:js` and commit changes.
- [ ] Run `composer build:dir` to prepare the plugin for quality checks.
- [ ] Run a WP VIP scan with `composer check:phpcs` to ensure no warnings or errors greater than 5 exist.
- [ ] Update the language files with `composer gen:lang` and note this in the changelog.
- [ ] For minor and patch releases, maintain backward compatibility (e.g., renamed or moved classes, namespaces, functions). Include deprecation comments and note this in the changelog. Major releases may remove deprecated code; always note this in the changelog.
- [ ] Update the changelog in `/CHANGELOG.md` with a user-friendly description and correct release date.
- [ ] Update the changelog in `readme.txt`, maintaining records of the last 4-5 releases only.
- [ ] Confirm there are no uncommitted changes.
- [ ] Build the zip package with `composer build`, creating a new beta package in the `./dist` directory.
- [ ] Distribute the new package to the team for testing.

### Release Checklist

- [ ] Update the version number to a stable version in the main plugin file and `readme.txt` as per [tech documentation](https://rambleventures.slab.com/posts/version-numbers-58nmrk4b), and commit to the release branch.
- [ ] If anything changed in the code after test package distribution, redo the pre-release checklist.
- [ ] Build the final zip package with `composer build`, creating a new package in the `./dist` directory.
- [ ] Create and merge a Pull Request for the release branch into the `main` branch.
- [ ] Merge the `main` branch into the `development` branch.
- [ ] Establish the GitHub release on the `main` branch with the correct tag.

#### PublishPress.com Deployment

- [ ] Update the EDD registry on the Downloads menu, uploading the new package and updating the changelog.
- [ ] Perform a final test by updating the plugin on a staging site.
