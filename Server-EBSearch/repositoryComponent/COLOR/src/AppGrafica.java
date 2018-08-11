import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.GridLayout;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

public class AppGrafica {
	
	//variabili di istanza
	public static final int ROW = 300;
	public static final int COL= 400;
	private JFrame frame = new JFrame();
	private ImageIcon icon = new ImageIcon("C:\\Users\\DOMENICO\\Desktop\\JAVAproject\\COLOR\\src\\icona.jpg");
	private JPanel panelColore = new JPanel(new GridLayout(2,1)); //visualliza il colore
	private JLabel rgb = new JLabel();
	private JPanel panelPerLeSlider = new JPanel(new GridLayout(4,1));
	//per RED
	private JLabel red = new JLabel("Rosso ");
	private JPanel panelSliderRed = new JPanel();
	private JSlider sliderRed = new JSlider(0,255,0);
	//per GREEN
	private JLabel green = new JLabel("Green ");
	private JPanel panelSliderGreen = new JPanel();
	private JSlider sliderGreen = new JSlider(0,255,0); 
	//per BLUE
	private JLabel blue = new JLabel("Blue    ");
	private JPanel panelSliderBlue = new JPanel();
	private JSlider sliderBlue = new JSlider(0,255,0); 
	//costruttore
	public AppGrafica() {
		frame.setSize(ROW, COL);
		frame.setTitle("Crea il tuo colore!");
		frame.setDefaultCloseOperation(3);
		frame.setResizable(false);
		frame.setLocationRelativeTo(null);
		frame.setIconImage(icon.getImage());
		panelColore.setBackground(new Color(sliderRed.getValue(),sliderGreen.getValue(),sliderBlue.getValue()));
		frame.add(panelColore, BorderLayout.CENTER);
		
		//PER RED
		panelSliderRed.add(red);
		panelSliderRed.add(sliderRed);
		panelPerLeSlider.add(panelSliderRed);
		sliderRed.addChangeListener(new Red());
		//PER GREEN
		panelSliderGreen.add(green);
		panelSliderGreen.add(sliderGreen);
		panelPerLeSlider.add(panelSliderGreen);
		sliderGreen.addChangeListener(new Green());
		//PER BLUE
		panelSliderBlue.add(blue);
		panelSliderBlue.add(sliderBlue);
		panelPerLeSlider.add(panelSliderBlue);
		sliderBlue.addChangeListener(new Blue());
		rgb.setText("RGB CODE = "+sliderRed.getValue()+"   "+sliderGreen.getValue()+"   "+sliderBlue.getValue());
		panelPerLeSlider.add(rgb);
		frame.add(panelPerLeSlider, BorderLayout.SOUTH);
		frame.setVisible(true);
		
	}
	
	class Red implements ChangeListener {

		
		public void stateChanged(ChangeEvent arg0) {
			
			panelColore.setBackground(new Color(sliderRed.getValue(),sliderGreen.getValue(),sliderBlue.getValue()));
			rgb.setText("RGB CODE = "+sliderRed.getValue()+"   "+sliderGreen.getValue()+"   "+sliderBlue.getValue());
			panelPerLeSlider.add(rgb);
			panelPerLeSlider.repaint();
		}
	}
	
	class Green implements ChangeListener {

		
		public void stateChanged(ChangeEvent arg0) {
		
			panelColore.setBackground(new Color(sliderRed.getValue(),sliderGreen.getValue(),sliderBlue.getValue()));
			rgb.setText("RGB CODE = "+sliderRed.getValue()+"   "+sliderGreen.getValue()+"   "+sliderBlue.getValue());
			panelPerLeSlider.add(rgb);
			panelPerLeSlider.repaint();
		}
		
	}
	
	class Blue implements ChangeListener {

		
		public void stateChanged(ChangeEvent arg0) {
			
			panelColore.setBackground(new Color(sliderRed.getValue(),sliderGreen.getValue(),sliderBlue.getValue()));
			rgb.setText("RGB CODE = "+sliderRed.getValue()+"   "+sliderGreen.getValue()+"   "+sliderBlue.getValue());
			panelPerLeSlider.add(rgb);
			panelPerLeSlider.repaint();
		}
		
	}
		
	
	public static void main(String[] args) {
		
		AppGrafica o = new AppGrafica();
	}

}
