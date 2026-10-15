import { createWriteStream, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { isRunStopRequested, registerRunChild, RunStoppedError } from '../run-control.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEV_WORKSPACE_ROOT = resolve(__dirname, '../../..');

/**
 * Shared command execution context for release steps.
 */
export class Context {
  /**
   * @param {object} data
   * @param {{ cwd?: string, onLog?: (line: string) => void }} [options]
   */
  constructor(data = {}, options = {}) {
    this.data = data;
    this.cwd = options.cwd || process.cwd();
    this.onLog = options.onLog || (() => {});
    this._logPath = null;
    this._logStream = null;
  }

  /**
   * @param {string} msg
   */
  log(msg) {
    const line = `${msg}\n`;
    this.onLog(line);
    process.stderr.write(line);
  }

  setupDeployLog() {
    const cacheDir = resolve(this.cwd, 'dev-workspace-cache');
    try {
      mkdirSync(cacheDir, { recursive: true });
    } catch {
      return null;
    }
    const logPath = resolve(cacheDir, 'deploy.log');
    try {
      writeFileSync(logPath, '', 'utf8');
      this._logStream = createWriteStream(logPath, { flags: 'a' });
      this._logPath = logPath;
    } catch {
      return null;
    }
    return logPath;
  }

  closeLog() {
    const stream = this._logStream;
    this._logStream = null;
    if (!stream) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      stream.end(() => resolve());
      stream.on('error', () => resolve());
    });
  }

  /**
   * @param {string | Buffer} chunk
   */
  _writeLog(chunk) {
    const text = typeof chunk === 'string' ? chunk : chunk.toString();
    this.onLog(text);
    if (this._logStream && !this._logStream.destroyed) {
      try {
        this._logStream.write(text.replace(/\x1B\[[0-9;]*[A-Za-z]/g, ''));
      } catch {
        this.closeLog();
      }
    }
  }

  /**
   * @param {string} cmd
   * @param {{ timeout?: number }} [opts]
   */
  async exec(cmd, { timeout = 0 } = {}) {
    const { spawn } = await import('child_process');
    return new Promise((resolvePromise, reject) => {
      const child = spawn(cmd, {
        shell: true,
        cwd: this.cwd,
        stdio: ['inherit', 'pipe', 'pipe'],
      });
      registerRunChild(child);
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer =
        timeout > 0
          ? setTimeout(() => {
              timedOut = true;
              child.kill('SIGTERM');
            }, timeout)
          : null;

      child.stdout.on('data', (d) => {
        stdout += d;
        this._writeLog(d);
      });
      child.stderr.on('data', (d) => {
        stderr += d;
        this._writeLog(d);
      });
      child.on('close', (code, signal) => {
        if (timer) {
          clearTimeout(timer);
        }
        if (isRunStopRequested() && (signal === 'SIGTERM' || signal === 'SIGKILL')) {
          reject(new RunStoppedError());
          return;
        }
        if (timedOut) {
          const err = new Error(`Command timed out after ${timeout}ms: ${cmd}`);
          err.stdout = stdout;
          err.stderr = stderr;
          reject(err);
        } else if (code === 0) {
          resolvePromise(stdout);
        } else {
          const err = new Error(`Command failed (exit ${code}): ${cmd}`);
          err.stdout = stdout;
          err.stderr = stderr;
          err.exitCode = code;
          reject(err);
        }
      });
    });
  }

  /**
   * @param {string} cmd
   */
  async execInteractive(cmd) {
    const { spawn } = await import('child_process');
    return new Promise((resolvePromise, reject) => {
      const child = spawn(cmd, {
        shell: true,
        cwd: this.cwd,
        stdio: 'inherit',
      });
      registerRunChild(child);
      child.on('close', (code, signal) => {
        if (isRunStopRequested() && (signal === 'SIGTERM' || signal === 'SIGKILL')) {
          reject(new RunStoppedError());
          return;
        }
        if (code === 0) {
          resolvePromise();
        } else {
          const err = new Error(`Command failed (exit ${code}): ${cmd}`);
          err.exitCode = code;
          reject(err);
        }
      });
    });
  }

  /**
   * @param {string} cmd
   * @param {{ timeout?: number }} [opts]
   */
  /**
   * @param {string} text
   */
  _appendCapturedOutput(text) {
    if (!text || !text.trim()) {
      return;
    }
    const chunk = text.endsWith('\n') ? text : `${text}\n`;
    this._writeLog(chunk);
  }

  async execCapture(cmd, { timeout = 0, quiet = false } = {}) {
    if (!quiet) {
      this.log(`$ ${cmd}`);
    }
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    try {
      const { stdout, stderr } = await execAsync(cmd, {
        cwd: this.cwd,
        ...(timeout > 0 ? { timeout } : {}),
      });
      if (!quiet) {
        this._appendCapturedOutput(stdout);
        this._appendCapturedOutput(stderr);
      }
      return { stdout, stderr, code: 0 };
    } catch (err) {
      if (isRunStopRequested()) {
        throw new RunStoppedError();
      }
      if (err.killed || err.signal) {
        const stderr = `Command timed out after ${timeout}ms`;
        if (!quiet) {
          this._appendCapturedOutput(stderr);
        }
        return {
          stdout: err.stdout || '',
          stderr,
          code: null,
        };
      }
      if (!quiet) {
        this._appendCapturedOutput(err.stdout || '');
        this._appendCapturedOutput(err.stderr || err.message);
      }
      return {
        stdout: err.stdout || '',
        stderr: err.stderr || err.message,
        code: err.code || 1,
      };
    }
  }
}

export { DEV_WORKSPACE_ROOT };
