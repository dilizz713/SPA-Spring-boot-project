package lk.ijse.gdse71.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomerDTO {
    private Integer id;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[\\p{L}][\\p{L} .'-]{1,49}$",
            message = "Name must be 2–50 chars; letters, spaces, . ' - allowed")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "NIC is required")
    @Pattern(regexp = "^(?:\\d{9}[VvXx]|\\d{12})$",
            message = "NIC must be 9 digits + V/v/X/x or 12 digits")
    private String nic;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^(?:(?:\\+94|94)\\d{9}|0\\d{9})$",
            message = "Phone must be 0XXXXXXXXX or (+)94XXXXXXXXX")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;
}
