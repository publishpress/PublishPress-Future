export default {
  id: 'git_config',
  label: 'Verify git user configuration',
  phase: 'Pre-flight & Branch Setup',
  type: 'auto',
  instructions:
    'Ensures git user.name and user.email are configured so release commits show the correct author.',
  critical: true,

  setup: async (ctx) => {
    const nameResult = await ctx.execCapture('git config --global user.name');
    const emailResult = await ctx.execCapture('git config --global user.email');

    let name = nameResult.stdout.trim();
    let email = emailResult.stdout.trim();

    if (!name && process.env.GIT_USER_NAME) {
      ctx.data._gitName = process.env.GIT_USER_NAME.trim();
    }
    if (!email && process.env.GIT_USER_EMAIL) {
      ctx.data._gitEmail = process.env.GIT_USER_EMAIL.trim();
    }
    if (ctx.data._gitName) {
      name = ctx.data._gitName;
    }
    if (ctx.data._gitEmail) {
      email = ctx.data._gitEmail;
    }

    if (name && email) {
      return;
    }

    throw new Error(
      'Git user.name and user.email must be set (git config --global or GIT_USER_NAME / GIT_USER_EMAIL in .env).'
    );
  },

  run: async (ctx) => {
    if (ctx.data._gitName) {
      await ctx.exec(`git config --global user.name ${JSON.stringify(ctx.data._gitName)}`);
    }
    if (ctx.data._gitEmail) {
      await ctx.exec(`git config --global user.email ${JSON.stringify(ctx.data._gitEmail)}`);
    }

    const name = (await ctx.execCapture('git config --global user.name')).stdout.trim();
    const email = (await ctx.execCapture('git config --global user.email')).stdout.trim();
    if (!name) {
      throw new Error('git user.name is still not configured.');
    }
    if (!email) {
      throw new Error('git user.email is still not configured.');
    }

    ctx.log(`Git identity: ${name} <${email}>`);
  },
};
