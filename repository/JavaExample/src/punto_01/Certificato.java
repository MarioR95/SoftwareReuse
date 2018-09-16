package punto_01;

import java.io.Serializable;

public class Certificato implements Cloneable,Serializable{
	
	//variabili di istanza
	private int codiceNumerico;
	private String nomeEmittente;
	
	//costruttore
	public Certificato(int codiceNumerico, String nomeEmittente) {
		this.codiceNumerico = codiceNumerico;
		this.nomeEmittente = nomeEmittente;
	}
	
	//metodi di accesso
	public int getCodiceNumerico() {
		return codiceNumerico;
	}

	public String getNomeEmittente() {
		return nomeEmittente;
	}
	//metodi modificatori
	public void setCodiceNumerico(int codiceNumerico) {
		this.codiceNumerico = codiceNumerico;
	}

	public void setNomeEmittente(String nomeEmittente) {
		this.nomeEmittente = nomeEmittente;
	}

	//Override
	public String toString() {
		return getClass().getName()+"[codiceNumerico=" + codiceNumerico+ ", nomeEmittente=" + nomeEmittente + "]";
	}

	public boolean equals(Object obj) {
		if (obj == null) return false;
		if (getClass() != obj.getClass()) return false;
		Certificato other = (Certificato) obj;
		
		return codiceNumerico == other.codiceNumerico && nomeEmittente.equals(other.nomeEmittente);
	}
	
	public Certificato clone() {
		try {
			return (Certificato) super.clone();
		} catch (CloneNotSupportedException e) {
			return null;
		}
	}
	
}
