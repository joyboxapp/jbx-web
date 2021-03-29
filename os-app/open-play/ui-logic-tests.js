const { throws, deepEqual } = require('assert');

const mod = require('./ui-logic.js').default;

const uLocalized = function (inputData) {
	return inputData + '-LOCALIZED';
};

describe('JOXPlayAccessibilitySummary', function test_JOXPlayAccessibilitySummary() {

	it('throws if not valid', function () {
		throws(function () {
			mod.JOXPlayAccessibilitySummary({});
		}, /JOXErrorInputNotValid/);
	});

	it('returns string', function() {
		const JOXDocumentNotes = Math.random().toString();
		deepEqual(mod.JOXPlayAccessibilitySummary(StubDocumentObjectValid({
			JOXDocumentNotes,
		})), JOXDocumentNotes);
	});

	it('truncates long string', function() {
		const item = Array.from(Array(100)).map(Math.random).join(' ');
		deepEqual(mod.JOXPlayAccessibilitySummary(StubDocumentObjectValid({
			JOXDocumentNotes: item,
		})), require('OLSKString').OLSKStringSnippet(item));
	});

});

describe('JOXPlaySortFunction', function test_JOXPlaySortFunction() {

	it('sorts by JOXDocumentCreationDate descending', function() {
		const item1 = {
			JOXDocumentCreationDate: new Date(0),
		};
		const item2 = {
			JOXDocumentCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.JOXPlaySortFunction), [item2, item1]);
	});

	it('sorts JOXDocumentIsArchived below others', function() {
		const item1 = {
			JOXDocumentCreationDate: new Date(0),
			JOXDocumentIsArchived: true,
		};
		const item2 = {
			JOXDocumentCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.JOXPlaySortFunction), [item2, item1]);
	});

});

describe('JOXPlayIsMatch', function test_JOXPlayIsMatch() {

	it('throws error param2 if not string', function() {
		throws(function() {
			mod.JOXPlayIsMatch({}, null);
		}, /JOXErrorInputNotValid/);
	});

	it('returns false if no match', function() {
		deepEqual(mod.JOXPlayIsMatch({
			JOXDocumentNotes: 'alfa',
		}, 'bravo'), false);
	});

	it('matches OLSKStringMatch', function() {
		deepEqual(mod.JOXPlayIsMatch({
			JOXDocumentNotes: uRandomElement('alfa', 'álfa'),
		}, uRandomElement('alf', 'alfa', 'ALF')), true);
	});

});

describe('JOXPlayExactSortFunction', function test_JOXPlayExactSortFunction() {

	it('throws if param1 not string', function () {
		throws(function () {
			mod.JOXPlayExactSortFunction(null, Math.random().toString(), Math.random().toString());
		}, /JOXErrorInputNotValid/);
	});

	it('bumps startsWith', function() {
		const item = Math.random().toString();
		deepEqual(mod.JOXPlayExactSortFunction(item, {
			JOXDocumentNotes: Math.random().toString() + item,
		}, {
			JOXDocumentNotes: item + Math.random().toString(),
		}), 1);
	});

	it('matches OLSKStringMatch', function() {
		deepEqual(mod.JOXPlayExactSortFunction(uRandomElement('alf', 'alfa', 'ALF'), {
			JOXDocumentNotes: Math.random().toString(),
		}, {
			JOXDocumentNotes: uRandomElement('alfa', 'álfa'),
		}), 1);
	});

});

describe('JOXPlayDocuments', function test_JOXPlayDocuments () {

	it('throws if not string', function () {
		throws(function () {
			mod.JOXPlayDocuments(null);
		}, /JOXErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mod.JOXPlayDocuments(''), []);
	});

	it('parses single line', function () {
		const item = Math.random().toString();
		deepEqual(mod.JOXPlayDocuments(item), [{
			JOXDocumentNotes: item,
		}]);
	});

	it('parses multiple lines', function () {
		const item = [
			Math.random().toString(),
			Math.random().toString(),
		];
		deepEqual(mod.JOXPlayDocuments(item.join('\n')), item.map(function (e) {
			return {
				JOXDocumentNotes: e,
			};
		}));
	});

});
