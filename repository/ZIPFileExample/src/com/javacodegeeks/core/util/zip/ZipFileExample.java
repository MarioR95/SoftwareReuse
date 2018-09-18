package com.javacodegeeks.core.util.zip;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipFileExample {


    private static final String INPUT_FOLDER = "C:\\Users\\nikos\\Desktop\\TestFiles";
    private static final String ZIPPED_FOLDER = "C:\\Users\\nikos\\Desktop\\TestFiles.zip";


    public static void main(String[] args) {
        try {

            zip( INPUT_FOLDER, ZIPPED_FOLDER);
   
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void zip(String inputFolder,String targetZippedFolder)  throws IOException {

        FileOutputStream fileOutputStream = null;

        fileOutputStream = new FileOutputStream(targetZippedFolder);
        ZipOutputStream zipOutputStream = new ZipOutputStream(fileOutputStream);

        File inputFile = new File(inputFolder);

        if (inputFile.isFile())
            zipFile(inputFile,"",zipOutputStream);
        else if (inputFile.isDirectory())
            zipFolder(zipOutputStream,inputFile,"");

        zipOutputStream.close();
    }


    public static void zipFolder(ZipOutputStream zipOutputStream,File inputFolder, String parentName)  throws IOException {

        String myname = parentName +inputFolder.getName()+"\\";

        ZipEntry folderZipEntry = new ZipEntry(myname);
        zipOutputStream.putNextEntry(folderZipEntry);

        File[] contents = inputFolder.listFiles();

        for (File f : contents){
            if (f.isFile())
                zipFile(f,myname,zipOutputStream);
            else if(f.isDirectory())
                zipFolder(zipOutputStream,f, myname);
        }
        zipOutputStream.closeEntry();
    }


    public static void zipFile(File inputFile,String parentName,ZipOutputStream zipOutputStream) throws IOException{


        // A ZipEntry represents a file entry in the zip archive
        // We name the ZipEntry after the original file's name
        ZipEntry zipEntry = new ZipEntry(parentName);
        zipOutputStream.putNextEntry(zipEntry);

        FileInputStream fileInputStream = new FileInputStream(inputFile);
        byte[] buf = new byte[1024];
        int bytesRead;

        // Read the input file by chucks of 1024 bytes
        // and write the read bytes to the zip stream
        while ((bytesRead = fileInputStream.read(buf)) > 0) {
            zipOutputStream.write(buf, 0, bytesRead);
        }

        // close ZipEntry to store the stream to the file
        zipOutputStream.closeEntry();

        System.out.println("Regular file :" + parentName +" is zipped to archive :"+ZIPPED_FOLDER);
    }

   
/*
    private static String getParentDirectoryName(File baseDirectory,File inputFile){
       String absoluteName

    }
*/
    /**
     * Write to a file using a FileChanel
     */
    /*
    public static void writeWithFileChannelDMA(OutputStream outputStream, File inputFile, long count) {

        try (RandomAccessFile randomAccessFile = new RandomAccessFile(inputFile, "rw")) {

            // move the cursor to the end of the file
            randomAccessFile.seek(randomAccessFile.length());

            // obtain the a file channel from the RandomAccessFile
            try (
                    FileChannel fileChannel = randomAccessFile.getChannel();
                    WritableByteChannel outputChannel = Channels.newChannel(outputStream);
            ){

                fileChannel.transferTo(0,count,outputChannel);

            } catch (IOException e) {
                e.printStackTrace();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    */
}
