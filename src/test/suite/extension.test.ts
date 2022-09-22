import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { remote2Url } from '../../command/copyAsLink';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});

suite("remote2Url", () => {
	test('netease gitlab ssh', () => {
		assert.strictEqual(remote2Url('ssh://git@g.hz.netease.com:22222/cloudmusic-frontend/content/rn-podcast-book.git'), 'https://g.hz.netease.com/cloudmusic-frontend/content/rn-podcast-book');
	});
	test('netease gitlab https', () => {
		assert.strictEqual(remote2Url('https://g.hz.netease.com/cloudmusic-frontend/content/rn-podcast-book.git'), 'https://g.hz.netease.com/cloudmusic-frontend/content/rn-podcast-book');
	});
	test('gitlab ssh', () => {
		assert.strictEqual(remote2Url('git@gitlab.com:test/github-test.git'), 'https://gitlab.com/test/github-test');
	});
	test('gitlab https', () => {
		assert.strictEqual(remote2Url('https://gitlab.com/test/github-test.git'), 'https://gitlab.com/test/github-test');
	});
	test('github ssh', () => {
		assert.strictEqual(remote2Url('git@github.com:test/homepage.git'), 'https://github.com/test/homepage');
	});
	test('github https', () => {
		assert.strictEqual(remote2Url('https://github.com/test/homepage.git'), 'https://github.com/test/homepage');
	});
});
