package com.javacodegeeks.core.util.zip;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

public class WriteToFileExample {

	private static final String FILEPATH = "C:\\Users\\nikos\\Desktop\\TestFiles\\testFile.txt";

	public static void main(String[] args) throws IOException {

		String str1 = "abc";
		String str2 = "asdasfasfasfa";

		List<String> list = new ArrayList<String>();
		list.add(str1);
		list.add(str2);

		// useBufferedFileOutPutStream(list, FILEPATH);
		useFileOutPutStream(str1, FILEPATH);

	}

	/**
	 * Write a small string to a File - Use a FileWriter
	 */
	public static void useFileWriter(String content, String filePath) {
		Writer writer = null;

		try {

			writer = new FileWriter(filePath);
			writer.write(content);

		} catch (IOException e) {

			System.err.println("Error writing the file : ");
			e.printStackTrace();

		} finally {

			if (writer != null) {
				try {
					writer.close();
				} catch (IOException e) {

					System.err.println("Error closing the file : ");
					e.printStackTrace();
				}
			}

		}
	}

	/**
	 * Write a big list of Strings to a file - Use a BufferedWriter
	 */
	public static void useByfferedFileWriter(List<String> content,String filePath) {

		File file = new File(filePath);
		Writer fileWriter = null;
		BufferedWriter bufferedWriter = null;

		try {

			fileWriter = new FileWriter(file);
			bufferedWriter = new BufferedWriter(fileWriter);

			// Write the lines one by one
			for (String line : content) {
				line += System.getProperty("line.separator");
				bufferedWriter.write(line);
				// alternatively add bufferedWriter.newLine() to change line
			}

		} catch (IOException e) {
			System.err.println("Error writing the file : ");
			e.printStackTrace();
		} finally {

			if (bufferedWriter != null && fileWriter != null) {
				try {
					bufferedWriter.close();
					fileWriter.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

	}

	/**
	 * Write raw data to a small file - use FileOutPutStream
	 */
	public static void useFileOutPutStream(String content, String filePath) {

		OutputStream outputStream = null;

		try {

			outputStream = new FileOutputStream(new File(filePath));
			outputStream.write(content.getBytes(), 0, content.length());

		} catch (FileNotFoundException e) {
			System.err.println("Error Opening the file : ");
			e.printStackTrace();
		} catch (IOException e) {
			System.err.println("Error writing  the file : ");
			e.printStackTrace();
		} finally {

			if (outputStream != null) {
				try {
					outputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}

	}

	/**
	 * Write raw data to a big file - use BufferedWriter
	 */
	public static void useBufferedFileOutPutStream(List<String> content,
			String filePath) {
		Writer writer = null;

		try {

			// Using OutputStreamWriter you don't have to convert the String to
			// byte[]
			writer = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream(filePath), "utf-8"));

			for (String line : content) {
				line += System.getProperty("line.separator");
				writer.write(line);
			}

		} catch (IOException e) {

		} finally {

			if (writer != null) {
				try {
					writer.close();
				} catch (Exception e) {

				}
			}
		}

	}

}
