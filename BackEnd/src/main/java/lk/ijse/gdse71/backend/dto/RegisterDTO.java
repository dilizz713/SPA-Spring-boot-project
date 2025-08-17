package lk.ijse.gdse71.backend.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String fullName;
    private String username;
    private String password;
    private String role;
}
