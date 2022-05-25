import '@testing-library/jest-dom';
import testingLibrary from '@testing-library/dom';
import testingLibraryUserEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import nock from 'nock';
import init from '../src/init.js';

const { screen, waitFor } = testingLibrary;
const userEvent = testingLibraryUserEvent.default;

nock.disableNetConnect();

let elements;

beforeEach(() => {
  const pathToFixture = path.join('__tests__', '__fixtures__', 'index.html');
  const initHtml = fs.readFileSync(pathToFixture).toString();
  document.body.innerHTML = initHtml;
  init();

  elements = {
    submit: screen.getByRole('add'),
    urlInput: screen.getByRole('url'),
    feedback: screen.getByRole('feedback'),
  };
});

test('fresh application', async () => {
  expect(screen.getByRole('feedback')).toBeEmptyDOMElement();
});