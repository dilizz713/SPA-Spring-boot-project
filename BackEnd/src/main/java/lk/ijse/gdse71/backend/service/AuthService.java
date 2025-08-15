package lk.ijse.gdse71.backend.service;

import lk.ijse.gdse71.backend.dto.AuthDTO;
import lk.ijse.gdse71.backend.dto.AuthResponseDTO;
import lk.ijse.gdse71.backend.dto.RegisterDTO;
import lk.ijse.gdse71.backend.entiity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AuthService  {
    String register(RegisterDTO registerDTO);

    AuthResponseDTO authenticate(AuthDTO authDTO);
}
