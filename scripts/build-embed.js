const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'app', 'api');
const hiddenApiDir = path.join(root, 'app', '_api_embed_build');

if (fs.existsSync(hiddenApiDir)) {
  if (fs.existsSync(apiDir)) {
    throw new Error(`Cannot prepare embed build: both ${apiDir} and ${hiddenApiDir} exist`);
  }
  fs.renameSync(hiddenApiDir, apiDir);
}

if (!fs.existsSync(apiDir)) {
  throw new Error(`Cannot prepare embed build: ${apiDir} does not exist`);
}

let result;
try {
  // Static embeds call APIs through NEXT_PUBLIC_SCORE_EDITOR_API_BASE; they must
  // not export the server-only route handlers bundled with a normal deployment.
  fs.renameSync(apiDir, hiddenApiDir);
  result = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    env: {
      ...process.env,
      NEXT_PUBLIC_BUILD_MODE: 'embed',
      BUILD_MODE: 'embed',
      NEXT_PUBLIC_SCORE_EDITOR_API_BASE: '/api/score-editor',
    },
    stdio: 'inherit',
  });
} finally {
  if (fs.existsSync(hiddenApiDir)) {
    fs.renameSync(hiddenApiDir, apiDir);
  }
}

if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);
