package GGTeam.F3API;

public class ChatMessage {
	private String NombreUsuario;
    private String mensaje;

    // Getters y Setters
    public String getNombre() {
        return NombreUsuario;
    }

    public void setNombre(String NombreUsuario) {
        this.NombreUsuario = NombreUsuario;
    }

    public String getMessage() {
        return mensaje;
    }

    public void setMessage(String mensaje) {
        this.mensaje = mensaje;
    }
}
