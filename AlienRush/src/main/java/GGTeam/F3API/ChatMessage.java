package GGTeam.F3API;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChatMessage {
	@JsonProperty("NombreUsuario")
    private String NombreUsuario;

    @JsonProperty("mensaje")
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
