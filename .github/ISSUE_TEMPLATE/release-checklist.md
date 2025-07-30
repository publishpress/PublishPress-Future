---
name: Release checklist (team only)
about: Describes the default checklist for the plugin's release process.
title: Release v[VERSION]
labels: release
type: release
assignees: ''
---

# Versioning

This project follows [Semantic Versioning](http://semver.org/) for version numbers. When planning the release, make sure to follow these guidelines:

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality additions
- PATCH version for backwards-compatible bug fixes
- When referencing versions, always use the full version number (e.g., 4.7.0 instead of 4.7) to avoid ambiguity between a specific patch release and a set of releases.

# Checklists for the Free plugin

To release the Free plugin, please check all the checkboxes below.

## Pre-release

- [ ] Create the release branch as `release-<version>` based on the development branch. Use the command: `git checkout -b release-<version> develop`.
- [ ] Merge any pending hotfixes or feature branches into the release branch using either direct merges or Pull Requests. Ensure all changes are properly reviewed and tested before merging.
- [ ] Review GitHub's Dependabot alerts and pull requests. Dismiss false positives and fix legitimate security issues.
- [ ] Run `composer update` to ensure all dependency is updated to the latest version.
- [ ] Run `composer build:js` to build JS files to production.
- [ ] Run `composer build:lang` to build translation files and commit the changes. Mention this on the changelog.
- [ ] Run `composer check` to run check the code and make sure no warnings or errors.
- [ ] Run `composer test Unit` to run the Unit tests and verify all tests pass successfully.
- [ ] Run `composer test Integration` to run Integration tests and verify all tests pass successfully.
- [ ] Run `composer set:version <version>` to update version numbers in plugin files.
- [ ] Update the changelog - ensure all changes are documented with clear, user-friendly descriptions. Verify the release date is accurate and the version number matches the release version. Include Pro features in the changelog, clearly marking them with `- PRO feature` or `- PRO` suffix to distinguish premium functionality from free features.
- [ ] Verify all changes are committed to the release branch and there are no uncommitted files or pending changes. Use `git status` to confirm the working directory is clean.
- [ ] Run `composer build` to build the zip package. It should create a package in the `./dist` directory.
- [ ] Send the new package to the team for testing and quality assurance review.

## Release

- [ ] Create a Pull Request from the release branch to the `master` branch, ensuring all changes are properly reviewed and approved before merging.
- [ ] Merge the Pull Request using squash merge to maintain a clean commit history on the `master` branch.
- [ ] Merge the `master` branch back into the `develop` branch to ensure development continues with the latest release changes.
- [ ] Create the GitHub release based on the `master` branch with the correct version tag (e.g., `4.7.0`). Include release notes summarizing key changes from the changelog. This will automatically trigger the GitHub action for deployment to the WordPress.org SVN repository.
- [ ] Monitor the GitHub Actions workflow progress on the [repository actions page](https://github.com/publishpress/publishpress-future/actions) to ensure the deployment to WordPress.org SVN repository completes successfully without errors.
- [ ] Visit the [WordPress.org plugin page](https://wordpress.org/plugins/post-expirator/) to verify the release was published successfully and all information is accurate.

## Post-release

- [ ] Perform final testing by updating the plugin on a staging site to verify the release works correctly in a real WordPress environment.
- [ ] Test key plugin functionality to ensure no regressions were introduced during the release process.
- [ ] Verify that the plugin version number displays correctly in the WordPress admin dashboard.

# Checklists for the Pro plugin

## Pre-release

- [ ] Create the release branch as `release-<version>` based on the development branch. Use the command: `git checkout -b release-<version> develop`.
- [ ] Merge any pending hotfixes or feature branches into the release branch using either direct merges or Pull Requests. Ensure all changes are properly reviewed and tested before merging.
- [ ] Review GitHub's Dependabot alerts and pull requests. Dismiss false positives and fix legitimate security issues.
- [ ] Update the reference for the `publishpress/publishpress-future` package in the `lib/composer.json` file to use the recently released version tag (e.g., `4.7.0`) instead of a branch reference. This ensures the Pro plugin uses the stable release of the Free plugin.
- [ ] Run `composer update` to ensure the free plugin dependency is updated to the latest version.
- [ ] Run `composer build:js` to build JS files to production.
- [ ] Run `composer build:lang` to build translation files and commit the changes. Mention this on the changelog.
- [ ] Run `composer check` to run check the code and make sure no warnings or errors.
- [ ] Run `composer test Unit` to run the Unit tests and verify all tests pass successfully.
- [ ] Run `composer test Integration` to run Integration tests and verify all tests pass successfully.
- [ ] Run `composer set:version <version>` to update version numbers in plugin files.
- [ ] Update the changelog - make sure all the changes are there with a user-friendly description, that the release date is correct, and that the version number matches the release version.
- [ ] Verify all changes are committed to the release branch and there are no uncommitted files or pending changes. Use `git status` to confirm the working directory is clean.
- [ ] Run `composer build` to build the zip package. It should create a package in the `./dist` directory.
- [ ] Send the new package to the team for testing and quality assurance review.

## Release

- [ ] Create a Pull Request from the release branch to the `master` branch, ensuring all changes are properly reviewed and approved before merging.
- [ ] Merge the Pull Request using squash merge to maintain a clean commit history on the `master` branch.
- [ ] Merge the `master` branch back into the `develop` branch to ensure development continues with the latest release changes.
- [ ] Create the GitHub release based on the `master` branch with the correct version tag (e.g., `4.7.0`). Include release notes summarizing key changes from the changelog.
- [ ] Monitor the GitHub Actions workflow progress on the [repository actions page](https://github.com/publishpress/publishpress-future-pro/actions) to ensure there is no error.
- [ ] Update the Pro plugin on the PublishPress website:
  - [ ] Navigate to [PublishPress site admin panel](https://publishpress.com/wp-admin) > Downloads and locate "Future Pro".
  - [ ] Upload the new package file to the media library and update the File URL in Download Files.
  - [ ] Update the version number in the Licensing section to match the release version.
  - [ ] Update the changelog in the Licensing section with the latest release notes.
  - [ ] Save all changes and verify the download link works correctly.

## Post-release

- [ ] Perform final testing by updating the plugin on a staging site to verify the release works correctly in a real WordPress environment.
- [ ] Test key plugin functionality to ensure no regressions were introduced during the release process.
- [ ] Verify that the plugin version number displays correctly in the WordPress admin dashboard.
- [ ] Confirm that all Pro features are working as expected and license validation is functioning properly.
