/**
 * Run gh auth login with a PTY when available, else stdio inherit.
 *
 * @param {{ cwd?: string }} [options]
 */
export async function runGhAuthLogin(options = {}) {
  const cwd = options.cwd || process.cwd();
  const cmd =
    'gh auth login --hostname github.com --git-protocol https --web';

  try {
    const pty = await import('node-pty');
    await new Promise((resolve, reject) => {
      const term = pty.spawn('bash', ['-lc', cmd], {
        name: 'xterm-color',
        cwd,
        cols: 120,
        rows: 30,
        env: process.env,
      });
      term.onData((data) => {
        process.stdout.write(data);
      });
      term.onExit(({ exitCode }) => {
        if (exitCode === 0) {
          resolve();
        } else {
          reject(new Error(`gh auth login failed (exit ${exitCode})`));
        }
      });
    });
  } catch {
    const { spawn } = await import('child_process');
    await new Promise((resolve, reject) => {
      const child = spawn(cmd, { shell: true, cwd, stdio: 'inherit' });
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`gh auth login failed (exit ${code})`));
        }
      });
    });
  }

  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  await execAsync('gh auth setup-git', { cwd });
}
