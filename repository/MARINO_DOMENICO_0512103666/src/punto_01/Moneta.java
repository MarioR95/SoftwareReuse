package punto_01;

import java.io.Serializable;

public class Moneta implements Cloneable,Serializable{
	
	//variabili di istanza
	private int valore;
	
	//costruttore
	public Moneta(int valore) {
		this.valore = valore;
	}
	
	//metodi di accesso
	public int getValore() {
		return valore;
	}
	
	//metodi modificatori
	public void setValore(int valore) {
		this.valore = valore;
	}

	//Override
	public String toString() {
		return getClass().getName()+"[valore=" + valore + "]";
	}
	
	public boolean equals(Object obj) {
		if (obj == null) return false;
		if (getClass() != obj.getClass()) return false;
		Moneta other = (Moneta) obj;
		
		return valore == other.valore;
	}
	
	public Moneta clone() {
		try {
			return (Moneta) super.clone();
		} catch (CloneNotSupportedException e) {
			return null;
		}
	}
	
}
