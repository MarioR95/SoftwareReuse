package it.unisa.javat;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class Project {
	private String _projectName;
	private String _projectDir;
	private String _projectPath;
	private String _sourcePath;
	private String _libraryPath;
	private String _binaryPath;
	
	private List<String> _sourceFiles;
	
	public Project(String path, String outputPath) throws LocalException {
		
		try {
			Utils.print("Current directory:" + new File(".").getCanonicalPath());
		} catch (IOException e) {
			throw new LocalException("Unable to detect current working directory.");
		}		
		
		if (path == null)
			throw new LocalException("Project path is missed.");
		if (!FileManager.directoryExists(path))
			throw new LocalException("Project path is not valid.");

		if (outputPath == null)
			throw new LocalException("Output path is missed.");
		if (!FileManager.directoryExists(outputPath)) {
			if(!FileManager.createDirectory(outputPath))
				throw new LocalException("Output path is not available.");
		}		
			
		Utils.print("Project setting.");
		if (path.endsWith(File.separator))
			path = path.substring(0, path.length() - 1);

		_projectPath = path;
		int pos = path.lastIndexOf(File.separator);
		if (pos > -1) {
			_projectDir = path.substring(0, pos);
			_projectName = path.substring(pos + 1);
		} else {
			_projectDir = ".";
			_projectName = path;
		}

		_sourcePath = _projectPath + File.separator + Constants.sourcePath;
		if (!FileManager.directoryExists(_sourcePath)) {
			throw new LocalException("Source directory is not present.");
		}

		_libraryPath = _projectPath + File.separator + Constants.libraryPath;
		if (!FileManager.directoryExists(_libraryPath)) {
			if(!FileManager.createDirectory(_libraryPath))
				throw new LocalException("Library directory is not available.");
		}

		_binaryPath = _projectPath + File.separator + Constants.binaryPath;
		if (!FileManager.directoryExists(_binaryPath)) {
			if(!FileManager.createDirectory(_binaryPath))
				throw new LocalException("Binary directory is not available.");
		}
		
		scan();
	}
	
		
	public String getProjectName() {
		return _projectName;
	}

	public String getProjectDir() {
		return _projectDir;
	}

	public String getProjectPath() {
		return _projectPath;
	}

	public String getSourcePath() {
		return _sourcePath;
	}

	public String getLibraryPath() {
		return _libraryPath;
	}

	public String getBinaryPath() {
		return _binaryPath;
	}

	public void print() {
		Utils.print("Project name:" + _projectName);
		Utils.print("Project directory:" + _projectDir);
		Utils.print("Project path:" + _projectPath);
		Utils.print("Source path:" + _sourcePath);
		Utils.print("Library path:" + _libraryPath);
		Utils.print("Binary path:" + _binaryPath);		
	}
	
	private void scan() {
			Utils.print("File scanning.");
			Utils.print("Source directory:" + getSourcePath());
		    _sourceFiles = FileManager.scanProject(getSourcePath());
	}
	
	public List<String> getSourceFiles() {
		return _sourceFiles;
	}
}
