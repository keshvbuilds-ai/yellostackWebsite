const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/components/3d/layerStoryPose.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { layerStoryPose } = context.exports;

test('each chapter brings only its own plate forward', () => {
  for (let i = 0; i < 3; i++) {
    const p = i * .25 + .13;
    const active = layerStoryPose(p, i);
    assert.ok(active.emphasis > .99);
    assert.ok(active.z > 2);
    for (let j = 0; j < 3; j++) if (j !== i) {
      assert.equal(layerStoryPose(p, j).emphasis, 0);
      assert.ok(layerStoryPose(p, j).z < 0);
    }
  }
});
test('start and finish restore the complete logo', () => {
  for (const p of [0, 1]) for (let i = 0; i < 3; i++) {
    const pose = layerStoryPose(p, i);
    assert.ok(Math.abs(pose.x) < 1e-8);
    assert.ok(Math.abs(pose.z) < 1e-8);
    assert.equal(pose.y, (1 - i) * 1.02);
    assert.equal(pose.scale, 1);
  }
});
test('scrubbing has continuous, deterministic transforms in either direction', () => {
  for (let i = 0; i < 3; i++) for (let n = 1; n <= 1000; n++) {
    const p = n / 1000;
    const previous = layerStoryPose(p - .001, i);
    const current = layerStoryPose(p, i);
    for (const key of ['x', 'y', 'z', 'rotationY', 'rotationZ', 'scale']) {
      assert.ok(Number.isFinite(current[key]));
      assert.ok(Math.abs(current[key] - previous[key]) < .15);
    }
    layerStoryPose(1 - p, i);
    assert.deepEqual(layerStoryPose(p, i), current);
  }
});
