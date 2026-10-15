/**
 * After a step that generates files, commit changes when the tree is dirty.
 *
 * @param {import('../engine/context.mjs').Context} ctx
 * @param {string} defaultMessage
 */
export async function commitIfDirty(ctx, defaultMessage) {
  const status = await ctx.execCapture('git status --short');
  if (!status.stdout.trim()) {
    return;
  }

  ctx.log('Working directory has changes after this step; committing with default message.');
  process.stdout.write(status.stdout + '\n');

  const message = defaultMessage.trim();
  if (!message) {
    throw new Error('Cannot auto-commit: default commit message is empty.');
  }

  await ctx.exec('git add -A');
  await ctx.exec(`git commit -m ${JSON.stringify(message)}`);
  ctx.log('Changes committed.');
}
