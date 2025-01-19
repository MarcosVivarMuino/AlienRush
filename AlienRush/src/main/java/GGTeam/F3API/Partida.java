package GGTeam.F3API;

import java.util.ArrayList;
import java.util.List;

public class Partida {

	private int id;
	// Jugador 1
    private int player1X;
    private int player1Y;
    private int player1Score;
    private int player1Vidas;
    private int player1Speed;
    private float player1Size;
    private float player1Multiplicador;
    private boolean player1CanPU;
    private String player1Nombre;

    // Jugador 2
    private int player2X;
    private int player2Y;
    private int player2Score;
    private int player2Vidas;
    private int player2Speed;
    private float player2Size;
    private float player2Multiplicador;
    private boolean player2CanPU;
    private String player2Nombre;

    // Objetos en la escena
    private List<Objeto> humanos;
    private List<Objeto> vacas;
    private List<Objeto> militares;
    private List<Objeto> PUHumanos;
    private List<Objeto> escombros;

    //Otras variables
    private boolean pausa;
    
    // Constructor
    public Partida() {
    	this.id = 0;
        this.humanos = new ArrayList<>();
        this.vacas = new ArrayList<>();
        this.militares = new ArrayList<>();
        this.PUHumanos = new ArrayList<>();
        this.escombros = new ArrayList<>();
        this.pausa = false;
        this.player1Vidas = 5;
        this.player1Speed = 10;
        this.player1Size = 0.8f;
        this.player1Multiplicador = 1f;
        this.player1CanPU = true;
        this.player2Vidas = 5;
        this.player2Speed = 10;
        this.player2Size = 0.8f;
        this.player2Multiplicador = 1f;
        this.player2CanPU = true;
        
    }

    public boolean isPausa() {return pausa;}
    public void setPausa(boolean pausa) { this.pausa = pausa;}
    
    //Getters y Setters partida
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getPlayer1Nombre() {
        return player1Nombre;
    }

    public void setPlayer1Nombre(String player1Nombre) {
        this.player1Nombre = player1Nombre;
    }

    public String getPlayer2Nombre() {
        return player2Nombre;
    }

    public void setPlayer2Nombre(String player2Nombre) {
        this.player2Nombre = player2Nombre;
    }

    //Getters y Setters para los jugadores
    public int getPlayer1X() { return player1X; }
    public void setPlayer1X(int player1X) { this.player1X = player1X; }

    public int getPlayer1Y() { return player1Y; }
    public void setPlayer1Y(int player1Y) { this.player1Y = player1Y; }

    public int getPlayer1Score() { return player1Score; }
    public void setPlayer1Score(int player1Score) { this.player1Score = player1Score; }
    
    public int getPlayer1Vidas() { return player1Vidas; }
    public void setPlayer1Vidas(int player1Vidas) { this.player1Vidas = player1Vidas; }

    public int getPlayer1Speed() { return player1Speed; }
    public void setPlayer1Speed(int player1Speed) { this.player1Speed = player1Speed; }

    public float getPlayer1Size() { return player1Size; }
    public void setPlayer1Size(float player1Size) { this.player1Size = player1Size; }
    
    public float getPlayer1Multiplicador() { return player1Multiplicador; }
    public void setPlayer1Multiplicador(float player1Multiplicador) { this.player1Multiplicador = player1Multiplicador; }

    public boolean getPlayer1CantPU() { return player1CanPU; }
    public void setPlayer1CantPU(boolean player1CanPU) { this.player1CanPU = player1CanPU; }



    public int getPlayer2X() { return player2X; }
    public void setPlayer2X(int player2X) { this.player2X = player2X; }

    public int getPlayer2Y() { return player2Y; }
    public void setPlayer2Y(int player2Y) { this.player2Y = player2Y; }

    public int getPlayer2Score() { return player2Score; }
    public void setPlayer2Score(int player2Score) { this.player2Score = player2Score; }
    
    public int getPlayer2Vidas() { return player2Vidas; }
    public void setPlayer2Vidas(int player2Vidas) { this.player2Vidas = player2Vidas; }

    public int getPlayer2Speed() { return player2Speed; }
    public void setPlayer2Speed(int player2Speed) { this.player2Speed = player2Speed; }

    public float getPlayer2Size() { return player2Size; }
    public void setPlayer2Size(float player2Size) { this.player2Size = player2Size; }
    
    public float getPlayer2Multiplicador() { return player2Multiplicador; }
    public void setPlayer2Multiplicador(float player2Multiplicador) { this.player2Multiplicador = player2Multiplicador; }

    public boolean getPlayer2CantPU() { return player2CanPU; }
    public void setPlayer2CantPU(boolean player2CanPU) { this.player2CanPU = player2CanPU; }


    // Métodos para gestionar los objetos
    public List<Objeto> getHumanos() { return humanos; }
    public void setHumanos(List<Objeto> humanos) { this.humanos = humanos; }

    public List<Objeto> getVacas() { return vacas; }
    public void setVacas(List<Objeto> vacas) { this.vacas = vacas; }

    public List<Objeto> getMilitares() { return militares; }
    public void setMilitares(List<Objeto> militares) { this.militares = militares; }

    public List<Objeto> getPUHumanos() { return PUHumanos; }
    public void setPUHumanos(List<Objeto> PUHumanos) { this.PUHumanos = PUHumanos; }

    public List<Objeto> getEscombros() { return escombros; }
    public void setEscombros(List<Objeto> escombros) { this.escombros = escombros; }

    public void inicializarPartida(int id, String usuario1, String usuario2, List<Objeto> humanos, 
    		List<Objeto> vacas, List<Objeto> militares,
        List<Objeto> PUHumanos, List<Objeto> powerUps) {
        this.id = id;
        this.player1Nombre = usuario1;
        this.player2Nombre = usuario2;
		this.humanos = humanos != null ? humanos : new ArrayList<>();
		this.vacas = vacas != null ? vacas : new ArrayList<>();
		this.militares = militares != null ? militares : new ArrayList<>();
		this.PUHumanos = PUHumanos != null ? PUHumanos : new ArrayList<>();
		this.escombros = escombros != null ? escombros : new ArrayList<>();
		this.pausa = false;
		
		// Valores iniciales para los jugadores
		this.player1Vidas = 5;
		this.player1Speed = 10;
		this.player1Size = 0.8f;
		this.player1Multiplicador = 1f;
		this.player1CanPU = true;
		
		this.player2Vidas = 5;
		this.player2Speed = 10;
		this.player2Size = 0.8f;
		this.player2Multiplicador = 1f;
		this.player2CanPU = true;
	}

    
    public void moverObjetos() {
        // Mover humanos
        for (Objeto humano : humanos) {
            moverObjetoAleatoriamente(humano, 100, 100, 80, 1680, 80, 800);
        }

        // Mover vacas
        for (Objeto vaca : vacas) {
            moverObjetoAleatoriamente(vaca, 150, 150, 80, 1680, 80, 800);
        }

        // Mover militares
        for (Objeto militar : militares) {
            moverObjetoAleatoriamente(militar, 80, 80, 80, 1680, 80, 800);
        }

        // Mover power-ups humanos
        for (Objeto PUHuman : PUHumanos) {
            moverObjetoAleatoriamente(PUHuman, 100, 100, 80, 1680, 80, 800);
        }

        // Mover power-ups genéricos
        for (Objeto escombros : escombros) {
            moverObjetoAleatoriamente(escombros, 120, 120, 80, 1680, 80, 800);
        }
    }

    // Método auxiliar para mover un objeto aleatoriamente dentro de los límites
    private void moverObjetoAleatoriamente(Objeto objeto, int deltaX, int deltaY, int minX, int maxX, int minY, int maxY) {
        int nuevaX = objeto.getX() + (int) (Math.random() * (2 * deltaX + 1)) - deltaX;
        int nuevaY = objeto.getY() + (int) (Math.random() * (2 * deltaY + 1)) - deltaY;

        // Respetar límites
        nuevaX = Math.max(minX, Math.min(nuevaX, maxX));
        nuevaY = Math.max(minY, Math.min(nuevaY, maxY));

        // Actualizar posiciones
        objeto.setX(nuevaX);
        objeto.setY(nuevaY);
    }

    public void actualizarPartida(Partida nuevaPartida) {
        this.player1X = nuevaPartida.getPlayer1X();
        this.player1Y = nuevaPartida.getPlayer1Y();
        this.player1Score = nuevaPartida.getPlayer1Score();
        this.player1Vidas = nuevaPartida.getPlayer1Vidas();
        this.player1Speed = nuevaPartida.getPlayer1Speed();
        this.player1Size = nuevaPartida.getPlayer1Size();
        this.player1Multiplicador = nuevaPartida.getPlayer1Multiplicador();
        this.player1CanPU = nuevaPartida.getPlayer1CantPU();

        this.player2X = nuevaPartida.getPlayer2X();
        this.player2Y = nuevaPartida.getPlayer2Y();
        this.player2Score = nuevaPartida.getPlayer2Score();
        this.player2Vidas = nuevaPartida.getPlayer2Vidas();
        this.player2Speed = nuevaPartida.getPlayer2Speed();
        this.player2Size = nuevaPartida.getPlayer2Size();
        this.player2Multiplicador = nuevaPartida.getPlayer2Multiplicador();
        this.player2CanPU = nuevaPartida.getPlayer2CantPU();

        this.humanos = nuevaPartida.getHumanos();
        this.vacas = nuevaPartida.getVacas();
        this.militares = nuevaPartida.getMilitares();
        this.PUHumanos = nuevaPartida.getPUHumanos();
        this.escombros = nuevaPartida.getEscombros();
    }


    // Clase interna para los objetos
    public static class Objeto {
        private int x;
        private int y;

        public Objeto(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() { return x; }
        public void setX(int x) { this.x = x; }

        public int getY() { return y; }
        public void setY(int y) { this.y = y; }
    }
}
