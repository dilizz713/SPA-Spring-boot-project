package lk.ijse.gdse71.backend.dto;

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
    private String name;
    private String address;
    private String nic;
    private String phone;
    private String email;
}
