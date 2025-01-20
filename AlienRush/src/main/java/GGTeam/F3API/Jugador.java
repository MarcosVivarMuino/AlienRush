package GGTeam.F3API;

//Clase interna para jugadores
public class Jugador {
    private float x;
    private float y;
    private int score;
    private int vidas = 5;
    private int speed = 10;
    private float size = 0.8f;
    private int multiplicador = 1;
    private boolean canPU = true;
    private String nombre;
    private int partidaId; // Nuevo campo para almacenar el ID de la partida
    
    public void inicializar(String nombre, int partidaId) {
        this.nombre = nombre;
        this.partidaId = partidaId;
        this.score = 0;
        this.vidas = 5;
        this.speed = 10;
        this.size = 0.8f;
        this.multiplicador = 1;
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
    public float getX() { return x; }
    public void setXPositiva() { this.x += speed; };
    public void setXNegativa() { this.x -= speed; }
    public void setX(float x) { this.x = x; }

    public int getPartidaId() {
        return partidaId;
    }

    public void setPartidaId(int partidaId) {
        this.partidaId = partidaId;
    }

    public float getY() { return y; }
    public void setYPositiva() { this.y += speed; }
    public void setYNegativa() { this.y -= speed; }
    public void setY(float y) { this.y = y; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getVidas() { return vidas; }
    public void setVidas() { this.vidas--; }

    public int getSpeed() { return speed; }
    public void setSpeed(int speed) { this.speed = speed; }

    public float getSize() { return size; }
    public void setSize(float size) { this.size = size; }

    public int getMultiplicador() { return multiplicador; }
    public void setMultiplicador(int multiplicador) { this.multiplicador = multiplicador; }

    public boolean isCanPU() { return canPU; }
    public void setCanPU(boolean canPU) { this.canPU = canPU; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
