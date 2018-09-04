package punto_01;

import java.io.Serializable;

import punto_02.Valutabile;

public class MonetaInCorso extends MonetaConiata implements Valutabile<Integer>,Serializable{
	
	//variabili di istanza
	private Certificato certificato;
	
	//costruttore
	public MonetaInCorso(int valore, int annoConio, String nazione,Certificato certificato) {
		super(valore, annoConio, nazione);
		this.certificato = certificato;
	}
	
	//metodi di accesso
	public Certificato getCertificato() {
		return certificato;
	}
	//metodi modificatori
	public void setCertificato(Certificato certificato) {
		this.certificato = certificato;
	}

	//Override
	public String toString() {
		return super.toString()+"[certificato=" + certificato + "]";
	}


	public boolean equals(Object obj) {
		if (!super.equals(obj)) return false;
		MonetaInCorso other = (MonetaInCorso) obj;
		
		return certificato.equals(other.certificato);
	}
	
	public MonetaInCorso clone() {
		MonetaInCorso m;
		m = (MonetaInCorso) super.clone();
		m.certificato = this.certificato.clone();
		return m;
	}

	// implementazione metodi dell'interfaccia
	public Integer valuta() {
		
		return this.getValore();
	}

	public Integer minimo() {
		
		return this.getAnnoConio();
	}
}
