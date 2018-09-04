package punto_01;

import java.io.Serializable;

import punto_02.Valutabile;

public final class MonetaFuoriCorso extends MonetaConiata implements Valutabile<Integer>,Serializable{
	
	//variabili di istanza
	private int annoFineCorsoLegale;
	
	//costruttore
	public MonetaFuoriCorso(int valore, int annoConio, String nazione,int annoFineCorsoLegale) {
		super(valore, annoConio, nazione);
		this.annoFineCorsoLegale = annoFineCorsoLegale;
	}
	
	//metodi di accesso
	public int getAnnoFineCorsoLegale() {
		return annoFineCorsoLegale;
	}
	//metodi modificatori
	public void setAnnoFineCorsoLegale(int annoFineCorsoLegale) {
		this.annoFineCorsoLegale = annoFineCorsoLegale;
	}

	//Override
	public String toString() {
		return super.toString()+"[annoFineCorsoLegale=" + annoFineCorsoLegale+ "]";
	}
	
	public boolean equals(Object obj) {
		if (!super.equals(obj)) return false;
		MonetaFuoriCorso other = (MonetaFuoriCorso) obj;
		
		return annoFineCorsoLegale == other.annoFineCorsoLegale;
	}
	
	public MonetaFuoriCorso clone() {
		return (MonetaFuoriCorso) super.clone();
	}

	// implementazione metodi dell'interfaccia
	public Integer valuta() {
		return this.getValore();
	}

	public Integer minimo() {
		
		return this.getAnnoConio();
	}
	
	
}
