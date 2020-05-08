import fs from 'fs';
import os from 'os';
import ProjectService from '../../app/services/project';

jest.mock('fs');
jest.mock('os');

const TEST_USER_HOME_PATH = '/User/test/';
os.homedir.mockReturnValue(TEST_USER_HOME_PATH);

const projectListString = `[
  {
    "id": "d01d2925-f6ff-4f8e-988f-fca2ee193427",
    "favorite": true,
    "lastAccessed": "2020-04-21T21:21:27.041Z",
    "path": "~/Development/projects/test1"
  },
  {
    "id": "6ff79e02-4f24-4948-ac77-f3f1b67064e5",
    "favorite": false,
    "lastAccessed": "2020-04-21T21:21:27.041Z",
    "path": "smb://fsmresfiles.fsm.northwestern.edu/fsmresfiles/Projects/Shared/Project2"
  }
]`;

const invalidProjectListString = `[
  {
    "id": "d01d2925-f6ff-4f8e-988f-fca2ee193427",
    "favorite": true,
    "lastAccessed": "2020-04-21T21:21:27.041Z",
    "path": "~/Development/projects/test1"
]`;

const projectString = `{
  "id": "d01d2925-f6ff-4f8e-988f-fca2ee193427",
  "name": "Test 1",
  "tags": [ "tag1", "tag2", "tag3" ]
}`;

const invalidProjectString = `{
  "id": "d01d2925-f6ff-4f8e-988f-fca2ee193427
}`;

describe('services', () => {
  describe('project', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    describe('loadListFromFile', () => {
      it('should return the list of projects', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(projectListString);
        const projects = new ProjectService().loadListFromFile(
          'test-project-list.json'
        );
        expect(projects.length).toBe(2);
        expect(fs.readFileSync).toHaveBeenCalledWith('test-project-list.json');
      });
      it('should throw an exception if the JSON is invalid', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(invalidProjectListString);
        expect(() =>
          new ProjectService().loadListFromFile('test-project-list.json')
        ).toThrow(SyntaxError);
      });
      it('should use the default file name when no parameter is specified', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(projectListString);
        const projects = new ProjectService().loadListFromFile();
        expect(projects.length).toBe(2);
        expect(fs.readFileSync).toHaveBeenCalledWith('.statwrap-projects.json');
      });
      it('should return an empty array if no file is found', () => {
        fs.existsSync.mockReturnValue(false);
        const projects = new ProjectService().loadListFromFile();
        expect(projects.length).toBe(0);
        expect(fs.readFileSync).not.toHaveBeenCalled();
      });
    });

    describe('loadFromFile', () => {
      it('should resolve the ~ home path', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(projectString);
        const project = new ProjectService().loadFromFile('~/Test/Path');
        expect(project).not.toBeNull();
        expect(fs.readFileSync).toHaveBeenCalledWith(
          `${TEST_USER_HOME_PATH}Test/Path/.statwrap-project.json`
        );
      });
      it('should return the project details', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(projectString);
        const project = new ProjectService().loadFromFile('/Test/Path');
        expect(project).not.toBeNull();
        expect(fs.readFileSync).toHaveBeenCalledWith(
          '/Test/Path/.statwrap-project.json'
        );
      });
      it('should throw an exception if the JSON is invalid', () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(invalidProjectString);
        // eslint-disable-next-line prettier/prettier
        expect(() => new ProjectService().loadFromFile('/Test/Path')).toThrow(SyntaxError);
      });
      it('should return null if the file path does not exist', () => {
        fs.existsSync.mockReturnValue(false);
        const project = new ProjectService().loadFromFile('/Test/Path');
        expect(project).toBeNull();
        expect(fs.readFileSync).not.toHaveBeenCalled();
      });
    });
  });
});
