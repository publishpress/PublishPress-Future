import preflight from '../../deploy/steps/preflight.mjs';
import gitConfig from '../../deploy/steps/git-config.mjs';
import githubAuth from '../../deploy/steps/github-auth.mjs';
import milestoneCheck from '../../deploy/steps/milestone-check.mjs';
import branchSetup from '../../deploy/steps/branch-setup.mjs';
import mergeHotfixes from '../../deploy/steps/merge-hotfixes.mjs';
import depDryRun from '../../deploy/steps/dep-dry-run.mjs';
import depReview from '../../deploy/steps/dep-review.mjs';
import buildJs from '../../deploy/steps/build-js.mjs';
import checkQualityPhp from '../../deploy/steps/check-quality-php.mjs';
import checkQualityLint from '../../deploy/steps/check-quality-lint.mjs';
import checkQualityCs from '../../deploy/steps/check-quality-cs.mjs';
import checkQualityLongpath from '../../deploy/steps/check-quality-longpath.mjs';
import testUnit from '../../deploy/steps/test-unit.mjs';
import testIntegration from '../../deploy/steps/test-integration.mjs';
import buildPackage from '../../deploy/steps/build-package.mjs';
import teamTesting from '../../deploy/steps/team-testing.mjs';
import translateAi from '../../deploy/steps/translate-ai.mjs';
import translateCommit from '../../deploy/steps/translate-commit.mjs';
import waitTranslatorEsFrIt from '../../deploy/steps/wait-translator-es-fr-it.mjs';
import waitTranslatorPtBr from '../../deploy/steps/wait-translator-pt-br.mjs';
import translateDownload from '../../deploy/steps/translate-download.mjs';
import translateCompile from '../../deploy/steps/translate-compile.mjs';
import changelogI18n from '../../deploy/steps/changelog-i18n.mjs';
import changelogReady from '../../deploy/steps/changelog-ready.mjs';
import setVersion from '../../deploy/steps/set-version.mjs';
import commitRelease from '../../deploy/steps/commit-release.mjs';
import checkReleaseGate from '../../deploy/steps/check-release-gate.mjs';
import createPr from '../../deploy/steps/create-pr.mjs';
import mergeToMaster from '../../deploy/steps/merge-to-master.mjs';
import mergeToDevelopment from '../../deploy/steps/merge-to-development.mjs';
import githubRelease from '../../deploy/steps/github-release.mjs';
import postRelease from '../../deploy/steps/post-release.mjs';
import checkWporgGate from '../../deploy/steps/check-wporg-gate.mjs';
import milestoneClose from '../../deploy/steps/milestone-close.mjs';

/** @type {import('./types.mjs').StepDefinition[]} */
export const freePreset = [
  preflight,
  gitConfig,
  githubAuth,
  milestoneCheck,
  branchSetup,
  mergeHotfixes,
  depDryRun,
  depReview,
  buildJs,
  checkQualityPhp,
  checkQualityLint,
  checkQualityCs,
  checkQualityLongpath,
  testUnit,
  testIntegration,
  buildPackage,
  teamTesting,
  translateAi,
  translateCommit,
  waitTranslatorEsFrIt,
  waitTranslatorPtBr,
  translateDownload,
  translateCompile,
  changelogI18n,
  changelogReady,
  setVersion,
  commitRelease,
  checkReleaseGate,
  createPr,
  mergeToMaster,
  mergeToDevelopment,
  githubRelease,
  postRelease,
  checkWporgGate,
  milestoneClose,
];
