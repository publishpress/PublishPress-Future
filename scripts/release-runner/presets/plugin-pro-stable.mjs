import preflight from '../steps/preflight.mjs';
import gitConfig from '../steps/git-config.mjs';
import githubAuth from '../steps/github-auth.mjs';
import milestoneCheck from '../steps/milestone-check.mjs';
import branchSetup from '../steps/branch-setup.mjs';
import mergeHotfixes from '../steps/merge-hotfixes.mjs';
import pinFreeLib from '../steps/pin-free-lib.mjs';
import depDryRun from '../steps/dep-dry-run.mjs';
import depReview from '../steps/dep-review.mjs';
import buildJs from '../steps/build-js.mjs';
import checkQualityPhp from '../steps/check-quality-php.mjs';
import checkQualityLint from '../steps/check-quality-lint.mjs';
import checkQualityCs from '../steps/check-quality-cs.mjs';
import checkQualityLongpath from '../steps/check-quality-longpath.mjs';
import testUnit from '../steps/test-unit.mjs';
import testIntegration from '../steps/test-integration.mjs';
import buildPackage from '../steps/build-package.mjs';
import teamTesting from '../steps/team-testing.mjs';
import translateAi from '../steps/translate-ai.mjs';
import translateCommit from '../steps/translate-commit.mjs';
import waitTranslatorEsFrIt from '../steps/wait-translator-es-fr-it.mjs';
import waitTranslatorPtBr from '../steps/wait-translator-pt-br.mjs';
import translateDownload from '../steps/translate-download.mjs';
import translateCompile from '../steps/translate-compile.mjs';
import changelogI18n from '../steps/changelog-i18n.mjs';
import changelogReady from '../steps/changelog-ready.mjs';
import setVersion from '../steps/set-version.mjs';
import commitRelease from '../steps/commit-release.mjs';
import checkReleaseGate from '../steps/check-release-gate.mjs';
import createPr from '../steps/create-pr.mjs';
import mergeToMaster from '../steps/merge-to-master.mjs';
import mergeToDevelopment from '../steps/merge-to-development.mjs';
import githubRelease from '../steps/github-release.mjs';
import packageServerCheck from '../steps/package-server-check.mjs';
import milestoneClose from '../steps/milestone-close.mjs';

/** @type {import('./types.mjs').StepDefinition[]} */
export const pluginProStablePreset = [
  preflight,
  gitConfig,
  githubAuth,
  milestoneCheck,
  branchSetup,
  mergeHotfixes,
  pinFreeLib,
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
  packageServerCheck,
  milestoneClose,
];
