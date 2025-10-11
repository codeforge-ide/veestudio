// src/lib/filesystem.ts

export interface File {
  id: string;
  name: string;
  content: string;
}

export interface Folder {
  id: string;
  name: string;
  files: File[];
  folders: Folder[];
}

export interface FileSystem {
  root: Folder;
}

const FILESYSTEM_KEY = 'veestudio_filesystem';

const getDefaultFileSystem = (): FileSystem => ({
  root: {
    id: 'root',
    name: 'root',
    files: [
      {
        id: 'hello-world',
        name: 'HelloWorld.sol',
        content: `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract HelloWorld {
    string public greet = "Hello World!";
}`,
      },
    ],
    folders: [],
  },
});

export const getFileSystem = (): FileSystem => {
  try {
    const stored = window.localStorage.getItem(FILESYSTEM_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse filesystem from localStorage', error);
  }
  return getDefaultFileSystem();
};

export const saveFileSystem = (filesystem: FileSystem): void => {
  try {
    window.localStorage.setItem(FILESYSTEM_KEY, JSON.stringify(filesystem));
  } catch (error) {
    console.error('Failed to save filesystem to localStorage', error);
  }
};

export const createFile = (folder: Folder, name: string): File => {
  const newFile: File = {
    id: `file-${Date.now()}`,
    name,
    content: '',
  };
  folder.files.push(newFile);
  return newFile;
};

export const createFolder = (parent: Folder, name: string): Folder => {
  const newFolder: Folder = {
    id: `folder-${Date.now()}`,
    name,
    files: [],
    folders: [],
  };
  parent.folders.push(newFolder);
  return newFolder;
};

export const findItem = (
  folder: Folder,
  id: string
): File | Folder | null => {
  if (folder.id === id) {
    return folder;
  }
  for (const file of folder.files) {
    if (file.id === id) {
      return file;
    }
  }
  for (const subFolder of folder.folders) {
    const found = findItem(subFolder, id);
    if (found) {
      return found;
    }
  }
  return null;
};

export const updateFileContent = (
  filesystem: FileSystem,
  fileId: string,
  content: string
): FileSystem => {
  const newFileSystem = { ...filesystem };
  const file = findItem(newFileSystem.root, fileId) as File;
  if (file && 'content' in file) {
    file.content = content;
  }
  return newFileSystem;
};

export const renameItem = (
  filesystem: FileSystem,
  itemId: string,
  newName: string
): FileSystem => {
  const newFileSystem = { ...filesystem };
  const item = findItem(newFileSystem.root, itemId);
  if (item) {
    item.name = newName;
  }
  return newFileSystem;
};

export const deleteItem = (
  filesystem: FileSystem,
  itemId: string
): FileSystem => {
  const newFileSystem = { ...filesystem };

  const findAndDelete = (folder: Folder, id: string): boolean => {
    const fileIndex = folder.files.findIndex((f) => f.id === id);
    if (fileIndex > -1) {
      folder.files.splice(fileIndex, 1);
      return true;
    }

    const folderIndex = folder.folders.findIndex((f) => f.id === id);
    if (folderIndex > -1) {
      folder.folders.splice(folderIndex, 1);
      return true;
    }

    for (const subFolder of folder.folders) {
      if (findAndDelete(subFolder, id)) {
        return true;
      }
    }

    return false;
  };

  findAndDelete(newFileSystem.root, itemId);
  return newFileSystem;
};
