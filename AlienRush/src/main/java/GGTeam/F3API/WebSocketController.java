package GGTeam.F3API;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

//import com.example.demo.GameData;
import F4WEB_SOCKET.Mensajes;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    @MessageMapping("/posiPlayer")
    @SendTo("/topic/posiPlayer")
    public PosiPlayers actuPosiPlayer(@Payload PosiPlayers m, SimpMessageHeaderAccessor HA) {  
        return m;
    
    }
    
    @MessageMapping("/muroRoto")
    @SendTo("/topic/muroRoto")
    public muroRoto actuMuroRoto(@Payload muroRoto m, SimpMessageHeaderAccessor HA) {  
        return m;
    
    }
    
    @MessageMapping("/pillarPU")
    @SendTo("/topic/pillarPU")
    public PUcogido PUpillado(@Payload PUcogido m, SimpMessageHeaderAccessor HA) {
        return m;
    
    }
    
    @MessageMapping("/usarPU")
    @SendTo("/topic/usarPU")
    public int PUUsado(@Payload int m, SimpMessageHeaderAccessor HA) {
        return m;
    
    }
    
    @MessageMapping("/PersoCogido")
    @SendTo("/topic/PersoCogido")
    public int PersoCogido(@Payload int m, SimpMessageHeaderAccessor HA) {
        return m;
    
    }
    
    @MessageMapping("/PersoListo")
    @SendTo("/topic/PersoListo")
    public int PersoListo(@Payload int m, SimpMessageHeaderAccessor HA) {
        return m;
    
    }
    
}
