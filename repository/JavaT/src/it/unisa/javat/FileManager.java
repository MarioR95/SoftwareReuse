package it.unisa.javat;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class typeFilter implements FileFilter {
	boolean _isDir = true;

	public typeFilter(boolean isDir) {
		_isDir = isDir;
	}

	@Override
	public boolean accept(File dir) {
		if (_isDir) {
			return (null != dir && dir.exists() && dir.isDirectory());
		}

		return (null != dir && dir.exists() && dir.isFile() && dir.getAbsolutePath().endsWith(Constants.fileExtension));
	}
}

class JarFilenameFilter implements FilenameFilter {
	@Override
	public boolean accept(File dir, String fileName) {
		return fileName.endsWith(Constants.jarExtension);
	}

}

public class FileManager {

	public static boolean fileExists(String path) {
		if (path == null)
			return false;
		File f = new File(path);
		return f.exists() && f.isFile();
	}

	public static boolean directoryExists(String path) {
		if (path == null)
			return false;
		File f = new File(path);
		return f.exists() && f.isDirectory();
	}

	public static boolean createDirectory(String path) {
		if (path == null)
			return false;
		File f = new File(path);
		return f.mkdir();
	}

	private static void scanDir(File path, List<String> files) {
		if (path == null || !path.exists())
			return;

		if (path.isDirectory()) {
			File[] dirContents = path.listFiles(new typeFilter(false));
			Arrays.sort(dirContents);
			for (File f : dirContents) {
				files.add(f.getAbsolutePath());
			}

			dirContents = path.listFiles(new typeFilter(true));
			Arrays.sort(dirContents);
			for (File f : dirContents) {
				scanDir(f, files); // Recursively
			}
		}

	}

	private static void cleanFilenames(String prefix, List<String> files) {
		for (int c = 0; c < files.size(); c++) {
			String file = files.get(c);
			if (file.startsWith(prefix)) {
				files.set(c, file.substring(prefix.length() + 1));
			}
		}

	}

	public static List<String> scanProject(String path) {
		List<String> files = new ArrayList<String>();

		if (path != null) {
			scanDir(new File(path), files);
			cleanFilenames(new File(path).getAbsolutePath(), files);
		}
		return files;
	}

	public static String readFileToString(String filePath) throws IOException {
		BufferedReader reader = null;
		StringBuilder result = new StringBuilder();
		try {
			reader = new BufferedReader(new FileReader(filePath));
			String line;
			while ((line = reader.readLine()) != null) {
				result.append(line + "\n");
			}
		} finally {
			if (reader != null)
				reader.close();
		}

		return result.toString();
	}

	public static void writeDirectory(String directoryPath) {
		
		File directory = new File(directoryPath);
		if(!directory.exists()) {
			directory.mkdirs();
		}
	}
	
	
	public static void writeFile(String filePath, String content) throws IOException {
		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter(filePath));
			writer.write(content);
		} finally {
				if (writer != null)
					writer.close();
		}
	}

}
