package GGTeam.F3API;

import java.util.concurrent.CopyOnWriteArrayList;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class controladorUsuarios {
	
	List<Usuario> listUsu = buscarLista();
	
	@GetMapping("/usuario/{nombre}")
	public ResponseEntity<Usuario> getUsuario(@PathVariable("nombre") String nombre) {
		boolean comp = false;
		Usuario aux = buscarUsuario(nombre);
		
		if(!aux.getNombre().equals(null) && !aux.getPassword().equals(null)) {
			comp = true;
		}
		if(comp){
			return new ResponseEntity<>(aux, HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/listausuarios")
	public boolean getLista() {
		Usuario aux;
		for(int i =0; i<listUsu.size();i++) {
			aux = listUsu.get(i);
			System.out.println(aux.getNombre());
			System.out.println(aux.getPassword());
		}
		return true;
	}
	
	@PostMapping("/usuario")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Usuario> newUsuario(@RequestBody Usuario u) {
		if(!findUsuario(u.getNombre())){
			listUsu.add(u);
			actuFichero();
			return new ResponseEntity<>(u, HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/usuario/{nombre}")
	public ResponseEntity<Usuario> deleteUsuario(@PathVariable("nombre") String nombre){
		boolean comp = false;
		Usuario aux;
		Usuario fin = listUsu.get(0);
		
		for(int i = 0; i<listUsu.size();i++) {
			aux = listUsu.get(i);
			if(aux.getNombre().equals(nombre)) {
				fin = aux;
				listUsu.remove(i);
				comp = true;
			}
		}
		if(comp){
			actuFichero();
			return new ResponseEntity<>(fin, HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PutMapping("/usuario/{nombre}")
	public ResponseEntity<Usuario> actuUsuario(@PathVariable("nombre") String nombre, @RequestBody Usuario u){
		boolean comp = false;
		Usuario aux;
		Usuario fin = listUsu.get(0);
		
		for(int i = 0; i<listUsu.size();i++) {
			aux = listUsu.get(i);
			if(aux.getNombre().equals(nombre)) {
				listUsu.set(i,u);
				comp = true;
				fin = aux;
			}
		}
		if(comp){
			actuFichero();
			return new ResponseEntity<>(fin, HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	public void actuFichero() {
        File file = new File("usuarios.txt");

        try (BufferedWriter bw = new BufferedWriter(new FileWriter(file))) {
        	for(int i =0;i<listUsu.size();i++) {
        		bw.write(listUsu.get(i).getNombre());
             	bw.newLine();
             	bw.write(listUsu.get(i).getPassword());
             	bw.newLine();
        	}
        } catch (IOException e) {
            e.printStackTrace();
        }
}
	public boolean findUsuario(String nombre) {
		File file = new File("usuarios.txt");

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            for(int i = 0;i<listUsu.size()*2-1;i++) {
            	line = br.readLine();
            	if(line.equals(nombre)) {
            		return true;
            	}
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
	}
	
	public Usuario buscarUsuario(String nombre) {
		File file = new File("usuarios.txt");
		Usuario aux = new Usuario();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            for(int i = 0;i<listUsu.size()*2-1;i++) {
            	line = br.readLine();
            	if(line.equals(nombre)) {
            		String s1 = line;
            		String s2 = br.readLine();
            		aux.setNombre(s1);
            		aux.setPassword(s2);
            	}
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return aux;
	}
	
	public List<Usuario> buscarLista() {
		File file = new File("usuarios.txt");
		List<Usuario> listAux = new CopyOnWriteArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
            	Usuario aux = new Usuario();
            	String s1 = line;
        		String s2 = br.readLine();
        		aux.setNombre(s1);
        		aux.setPassword(s2);
        		listAux.add(aux);
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
        return listAux;
	}
}