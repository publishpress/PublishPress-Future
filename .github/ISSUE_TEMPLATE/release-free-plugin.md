---
name: Release (team only)
about: Describes default checklist for the plugin's release process.
title: Release PublishPress Future v[VERSION]
labels: release
assignees: ''

---

To release the Free plugin please make sure to check all the checkboxes below.

### Pre-release Checklist

- [ ] Create the release branch as `release-<version>` based on the development branch.
- [ ] Make sure to directly merge or use Pull Requests to merge hotfixes or features branches into the release branch.
- [ ] Build JS files to production running `$ npm run jsbuild` and commit.
- [ ] Update the changelog - make sure all the changes are there with a user-friendly description and that the release date is correct, commit.
- [ ] Update the version number to the next stable version and commit.
- [ ] Build the zip package, running `$ npm run build`.
- [ ] Send to the team for testing.

### Release Checklist

- [ ] Create a Pull Request and merge the release branch it into the `master` branch.
- [ ] Merge the `master` branch into the `development` branch.
- [ ] Create the GitHub release (make sure it is based on the `master` branch and correct tag).

#### SVN Repo
- [ ] Cleanup the `trunk` directory.
- [ ] Unzip the built package and move files to the `trunk`.
- [ ] Remove any eventual file that shouldn't be released in the package (if you find anything, make sure to create an issue to fix the build script).
- [ ] Look for new files `$ svn status | grep \?` and add them using `$ svn add <each_file_path>`.
- [ ] Look for removed files `$ svn status | grep !` and remove them `$ svn rm <each_file_path>`.
- [ ] Create the new tag `$ svn cp trunk tags/<version>`.
- [ ] Commit the changes `$ svn ci -m 'Releasing <version>'`.
- [ ] Wait until WordPress updates the version number and make the final test updating the plugin in a staging site.
