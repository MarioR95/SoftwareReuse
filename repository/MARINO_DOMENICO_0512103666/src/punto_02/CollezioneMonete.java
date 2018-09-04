package punto_02;

import java.util.ArrayList;


public class CollezioneMonete<T extends Valutabile<Integer>> {

	//variabili di istanza
	private ArrayList<T> collezione;
	
	public CollezioneMonete(ArrayList<T> collezione) {
		this.collezione = collezione;
		
	}
	
	//metodi dell'astrazione
	public int valoreMedio() {
		int somma = 0;
		int contatore = 0;
		for(int i = 0; i < collezione.size(); i++) {
			somma += collezione.get(i).valuta();
			contatore++;
		}
		return somma / contatore;
	}
	
	public T monetaMinima() {
		T min = collezione.get(0);
		for(int i = 0; i < collezione.size(); i++) {
			if(collezione.get(i).minimo() < min.minimo() )
				min = collezione.get(i);
		}
		return min;
	}
}
