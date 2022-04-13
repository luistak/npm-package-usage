import {
  MOCKS_DIR,
  MOCKS_DIR_CWD,
  mockPackageUsageFile,
  cleanupMockFiles,
} from './utils';
import { getPackagesUsages } from '../src';

afterEach(() => {
  cleanupMockFiles();
});

beforeEach(() => {
  cleanupMockFiles();
});

describe('getPackagesUsages()', () => {
  describe('given a wrong file glob', () => {
    it('should THROW an Error', () => {
      const { pkg } = mockPackageUsageFile({});

      expect(() =>
        getPackagesUsages({
          packages: [pkg],
          fileGlobs: `WRONG_FILE_GLOB/**.xyz`,
        })
      ).toThrow();
    });
  });

  describe('given a file without import declaration', () => {
    it('should return a package usage without a single count', () => {
      const { pkg, version } = mockPackageUsageFile({
        customData: ` file data without import declaration `,
      });

      expect(
        getPackagesUsages({
          packages: [pkg],
          fileGlobs: `${MOCKS_DIR}/**.tsx`,
          packageJsonCWD: MOCKS_DIR_CWD,
        })
      ).toStrictEqual([{ count: 0, files: [], name: pkg, version }]);
    });
  });

  describe('given any package name and imports', () => {
    it('should return the right package usage', () => {
      const { fileName, imports, pkg, version } = mockPackageUsageFile({});

      expect(
        getPackagesUsages({
          packages: [pkg],
          fileGlobs: `${MOCKS_DIR}/**.tsx`,
          packageJsonCWD: MOCKS_DIR_CWD,
        })
      ).toStrictEqual([
        {
          count: 1,
          files: [
            {
              filePath: `${MOCKS_DIR_CWD}/${fileName}.tsx`,
              name: `${fileName}.tsx`,
              imports,
            },
          ],
          name: pkg,
          version,
        },
      ]);
    });
  });

  describe('given any package name and imports, and analyzeImportUsages as true', () => {
    it('should return the right package usage', () => {
      const { fileName, imports, pkg, version } = mockPackageUsageFile({
        analyzeImportUsages: true,
      });

      expect(
        getPackagesUsages({
          packages: [pkg],
          fileGlobs: `${MOCKS_DIR}/**.tsx`,
          analyzeImportUsages: true,
          packageJsonCWD: MOCKS_DIR_CWD,
        })
      ).toStrictEqual([
        {
          count: 1,
          files: [
            {
              filePath: `${MOCKS_DIR_CWD}/${fileName}.tsx`,
              name: `${fileName}.tsx`,
              imports,
            },
          ],
          name: pkg,
          version,
        },
      ]);
    });
  });
});
