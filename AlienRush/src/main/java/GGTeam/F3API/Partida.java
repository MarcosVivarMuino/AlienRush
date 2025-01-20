package GGTeam.F3API;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Partida {

	private int id;
	private boolean pausa;
	private int time;

	// Datos de los jugadores
	private Jugador jugador1;
	private Jugador jugador2;

	// Objetos en la escena
	private Objeto[] humanos;
	private Objeto[] vacas;
	private Objeto[] militares;
	private Objeto[] PUHumanos;
	private Objeto[] escombros;

	// Constructor
	public Partida() {
		this.jugador1 = new Jugador();
		this.jugador1.setX(200);
		this.jugador1.setY(600);
		this.jugador2 = new Jugador();
		this.jugador2.setX(1550);
		this.jugador2.setY(600);
		this.pausa = false;
		humanos = new Objeto[25];
		vacas = new Objeto[8];
		militares = new Objeto[2];
		PUHumanos = new Objeto[2];
		escombros = new Objeto[15];
	}

	// Getters y Setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public boolean isPausa() {
		return pausa;
	}
	
	public void setTime(int newTime) {
		this.time = newTime;
	}
	
	public int getTime() {
		return time;
	}


	public void setPausa(boolean pausa) {
		this.pausa = pausa;
	}

	public Jugador getJugador1() {
		return jugador1;
	}

	public void setJugador1(Jugador jugador1) {
		this.jugador1 = jugador1;
	}

	public Jugador getJugador2() {
		return jugador2;
	}

	public void setJugador2(Jugador jugador2) {
		this.jugador2 = jugador2;
	}

	public Objeto[] getHumanos() {
		return humanos;
	}

	public void setHumanos(Objeto[] humanos) {
		this.humanos = humanos;
	}

	public Objeto[] getVacas() {
		return vacas;
	}

	public void setVacas(Objeto[] vacas) {
		this.vacas = vacas;
	}

	public Objeto[] getMilitares() {
		return militares;
	}

	public void setMilitares(Objeto[] militares) {
		this.militares = militares;
	}

	public Objeto[] getPUHumanos() {
		return PUHumanos;
	}

	public void setPUHumanos(Objeto[] PUHumanos) {
		this.PUHumanos = PUHumanos;
	}

	public Objeto[] getEscombros() {
		return escombros;
	}

	public void setEscombros(Objeto[] escombros) {
		this.escombros = escombros;
	}

	// Inicializar la partida
	public void inicializarPartida(int id, String nombreJugador1, String nombreJugador2) {
		this.id = id;
		this.jugador1.inicializar(nombreJugador1, this.id);
		this.jugador2.inicializar(nombreJugador2, this.id);
		this.humanos = new Objeto[25];
		this.vacas = new Objeto[8];
		this.militares = new Objeto[2];
		this.PUHumanos = new Objeto[2];
		this.escombros = new Objeto[15];
		this.time = 120;
	
		this.pausa = false;
		inicializarListasRandom();
	}

	public void inicializarListasRandom() {
		Random random = new Random();

		// Inicializar los objetos en la lista de Humanos
		for (int i = 0; i < humanos.length; i++) {
			float randomX = (10 + random.nextFloat() * 1700); // Rango de 0 a 1000 para X
			float randomY = (20 + random.nextFloat() * 880); // Rango de 0 a 1000 para Y
			Objeto humano = new Objeto(randomX, randomY);
			humano.setId(i);
			humanos[i] = humano;
		}

		// Inicializar los objetos en la lista de Vacas
		for (int i = 0; i < vacas.length; i++) {
			float randomX = (10 + random.nextFloat() * 1700); // Rango de 0 a 1000 para X
			float randomY = (20 + random.nextFloat() * 880); // Rango de 0 a 1000 para Y
			Objeto vaca = new Objeto(randomX, randomY);
			vaca.setId(i);
			vacas[i] = vaca;
		}

		// Inicializar los objetos en la lista de Militares
		for (int i = 0; i < militares.length; i++) {
			float randomX = (10 + random.nextFloat() * 1700); // Rango de 0 a 1000 para X
			float randomY = (20 + random.nextFloat() * 880); // Rango de 0 a 1000 para Y
			Objeto militar = new Objeto(randomX, randomY);
			militar.setId(i);
			militares[i] = militar;
		}

		// Inicializar los objetos en la lista de PUHumanos
		for (int i = 0; i < PUHumanos.length; i++) {
			float randomX = (10 + random.nextFloat() * 1700); // Rango de 0 a 1000 para X
			float randomY = (20 + random.nextFloat() * 880); // Rango de 0 a 1000 para Y
			Objeto PUHumano = new Objeto(randomX, randomY);
			PUHumano.setId(i);
			PUHumanos[i] = PUHumano;
		}

		// Inicializar los objetos en la lista de Escombros
		for (int i = 0; i < escombros.length; i++) {
			float randomX = (10 + random.nextFloat() * 1700); // Rango de 0 a 1000 para X
			float randomY = (20 + random.nextFloat() * 880); // Rango de 0 a 1000 para Y
			Objeto escombro = new Objeto(randomX, randomY);
			escombro.setId(i);
			escombros[i] = escombro;
		}
	}
}