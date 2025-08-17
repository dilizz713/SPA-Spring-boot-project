package lk.ijse.gdse71.backend.service.impl;

import lk.ijse.gdse71.backend.dto.AuthDTO;
import lk.ijse.gdse71.backend.dto.AuthResponseDTO;
import lk.ijse.gdse71.backend.dto.RegisterDTO;
import lk.ijse.gdse71.backend.entiity.Role;
import lk.ijse.gdse71.backend.entiity.User;
import lk.ijse.gdse71.backend.repository.UserRepository;
import lk.ijse.gdse71.backend.service.AuthService;
import lk.ijse.gdse71.backend.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        User user = userRepository.findByUsername(authDTO.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        if(!passwordEncoder.matches(
                authDTO.getPassword(),
                user.getPassword())){
            throw new BadCredentialsException("Invalid Credentials");
        }

        String token = jwtUtil.generateToken(authDTO.username);
        return new AuthResponseDTO(token , user.getUsername() , user.getRole().name());
    }

    public String register(RegisterDTO registerDTO) {
        if(userRepository.findByUsername(registerDTO.getUsername()).isPresent()){
            throw new RuntimeException("Username is already exists");
        }
        User user = User.builder()
                .fullName(registerDTO.getFullName())
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .build();
        userRepository.save(user);
        return "User registered successfully";
    }
}
