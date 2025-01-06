To release the Free plugin version ensure you complete all the tasks below.

## Pre-release Checklist

- [ ] Review and merge all relevant Pull Requests into the release branch.
- [ ] Update the version number to a beta version in the main plugin file as per [tech documentation](https://rambleventures.slab.com/posts/version-numbers-58nmrk4b), and commit to the release branch.
- [ ] Start a dev-workspace session.
- [ ] Run `composer update` (updating root and lib vendors).
- [ ] Review updated packages and mention any production library updates in the changelog.
- [ ] Inspect GitHub’s Dependabot warnings or Pull Requests. Resolve any false positives, then fix and commit the remaining issues.
- [ ] If needed, build JS files for production using `composer build:js` and `composer build:js-dev` and commit changes.
- [ ] Run a code quality check with `composer check` and fix the highlighted issues.
- [ ] Update the language files with `composer gen:lang` and note this in the changelog.
- [ ] For minor and patch releases, maintain backward compatibility (e.g., renamed or moved classes, namespaces, functions). Include deprecation comments and note this in the changelog. Major releases may remove deprecated code; always note this in the changelog.
- [ ] Update the changelog in `/CHANGELOG.md` with a user-friendly description and correct release date.
- [ ] Update the changelog in `readme.txt`, maintaining records of the last 4-5 releases only.
- [ ] Confirm there are no uncommitted changes.
- [ ] Build the zip package with `composer build`, creating a new beta package in the `./dist` directory.
- [ ] Distribute the new package to the team for testing.

## Deployment Checklist

- [ ] Update the version number to a stable version in the main plugin file and `readme.txt` as per [tech documentation](https://rambleventures.slab.com/posts/version-numbers-58nmrk4b), and commit to the release branch.
- [ ] If anything changed in the code after test package distribution, redo the pre-release checklist.
- [ ] Build the final zip package with `composer build`, creating a new package in the `./dist` directory.
- [ ] Create and merge a Pull Request for the release branch into the `main` branch. Delete the release branch.
- [ ] Establish the GitHub release on the `main` branch with the correct tag.
- [ ] Merge the `main` branch into the `develop` branch.
- [ ] Follow up with the deployment process on the [GitHub Actions](https://github.com/publishpress/PublishPress-Future/actions) page.
- [ ] Await WordPress's version number update and perform a final test by updating the plugin on a staging site.
