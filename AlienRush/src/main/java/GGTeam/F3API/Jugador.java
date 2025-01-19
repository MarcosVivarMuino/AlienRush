package GGTeam.F3API;

//Clase interna para jugadores
public class Jugador {
    private int x;
    private int y;
    private int score;
    private int vidas = 5;
    private int speed = 10;
    private float size = 0.8f;
    private float multiplicador = 1f;
    private boolean canPU = true;
    private String nombre;
    private int partidaId; // Nuevo campo para almacenar el ID de la partida
    
    public void inicializar(String nombre, int partidaId) {
        this.nombre = nombre;
        this.x = 0;
        this.y = 0;
        this.partidaId = partidaId;
        this.score = 0;
        this.vidas = 5;
        this.speed = 10;
        this.size = 0.8f;
        this.multiplicador = 1f;
        this.canPU = true;
    }

    public void actualizar(Jugador nuevoJugador) {
        this.x = nuevoJugador.getX();
        this.y = nuevoJugador.getY();
        this.score = nuevoJugador.getScore();
        this.vidas = nuevoJugador.getVidas();
        this.speed = nuevoJugador.getSpeed();
        this.size = nuevoJugador.getSize();
        this.multiplicador = nuevoJugador.getMultiplicador();
        this.canPU = nuevoJugador.isCanPU();
    }

    // Getters y Setters
    public int getX() { return x; }
    public void setX(int x) { this.x = x; }

    public int getPartidaId() {
        return partidaId;
    }

    public void setPartidaId(int partidaId) {
        this.partidaId = partidaId;
    }

    public int getY() { return y; }
    public void setY(int y) { this.y = y; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getVidas() { return vidas; }
    public void setVidas(int vidas) { this.vidas = vidas; }

    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }

    public float getSize() { return size; }
    public void setSize(float size) { this.size = size; }

    public float getMultiplicador() { return multiplicador; }
    public void setMultiplicador(float multiplicador) { this.multiplicador = multiplicador; }

    public boolean isCanPU() { return canPU; }
    public void setCanPU(boolean canPU) { this.canPU = canPU; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
