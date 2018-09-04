package punto_01;

import java.io.Serializable;

public class MonetaConiata extends Moneta{
	
	//variabili di istanza
	private int annoConio;
	private String nazione;
	
	//costruttore
	public MonetaConiata(int valore, int annoConio, String nazione) {
		super(valore);
		this.annoConio = annoConio;
		this.nazione = nazione;
	}
	
	//metodi modificatori
	public int getAnnoConio() {
		return annoConio;
	}

	public String getNazione() {
		return nazione;
	}
	
	//metodi di accesso
	public void setAnnoConio(int annoConio) {
		this.annoConio = annoConio;
	}

	public void setNazione(String nazione) {
		this.nazione = nazione;
	}

	//Override
	public String toString() {
		return super.toString()+"[annoConio=" + annoConio + ", nazione=" + nazione+ "]";
	}

	public boolean equals(Object obj) {
		if (!super.equals(obj)) return false;
		MonetaConiata other = (MonetaConiata) obj;
		
		return annoConio == other.annoConio && nazione.equals(other.nazione);
	}
	
	public MonetaConiata clone() {
		return (MonetaConiata) super.clone();
	}
	
}
