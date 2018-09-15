package it.unisa.javat;

import java.nio.CharBuffer;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class Utils {
	
	public static String spaces( int spaces ) {
		  return CharBuffer.allocate( spaces ).toString().replace( '\0', ' ' );
		}
	
	public static void print(String message) {
		
		boolean multiple = message.contains("\n");
		String format = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss.SSS").format(new Timestamp(new java.util.Date().getTime()));
		String base = "["+format+"] "+Constants.appAcro;
		int length = base.length();
		
		if(multiple) {
			String[] messages = message.split("\n");
			System.out.println(base + "::");
			for(String s : messages) {
				System.out.println(spaces(length+3)+s);
			}
			//System.out.println(base + ":]");
			
		} else
			System.out.println(base + ":: " + message);
	}

	public static void print(Exception e) {
		print("ERROR: "+e.getMessage());
		e.printStackTrace();
	}


}
