package punto_03;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import punto_01.Certificato;
import punto_01.Moneta;
import punto_01.MonetaFuoriCorso;
import punto_01.MonetaInCorso;

public class Test {
	
	
	public static void main(String[] args) {
		
		File unFile = new File("monete.dat");
		Moneta[] contenitore ;
		
		if(unFile.exists()) {
			System.out.println("Testo lettura");
			try {
				ObjectInputStream in;
				in = new ObjectInputStream(new FileInputStream(unFile));
				contenitore = (Moneta[]) in.readObject();
				System.out.println("ho letto queso array contenete i seguenti:");
				for(int i = 0; i < 4; i++) {
					System.out.println(contenitore[i].toString());
				}
				in.close();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
			
		}else {
			MonetaInCorso monetaCorso1 = new MonetaInCorso(1, 1992,"Italia", new Certificato(123,"Stato"));
			MonetaInCorso monetaCorso2 = new MonetaInCorso(2, 1995,"Italia", new Certificato(123,"Stato1"));
			MonetaFuoriCorso monetaFuori1 = new MonetaFuoriCorso(5, 2000, "Italia", 2020);
			MonetaFuoriCorso monetaFuori2 = new MonetaFuoriCorso(6, 1990,"italia",2030);
			contenitore = new Moneta[4];
			contenitore[0] = monetaCorso1;
			contenitore[1] = monetaCorso2;
			contenitore[2] = monetaFuori1;
			contenitore[3] = monetaFuori2;
			
			System.out.println("testo scrittura:");
			try {
				ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(unFile));
				System.out.println("scrivo questi file:");
				for(int i = 0; i < contenitore.length; i++) {
					System.out.println(contenitore[i].toString());
				}
				out.writeObject(contenitore);
				out.close();
				
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}
	}
}
