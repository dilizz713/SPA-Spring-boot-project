package lk.ijse.gdse71.backend.entiity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.query.Order;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String address;
    private String nic;
    private String phone;
    private String email;

    @OneToMany(mappedBy = "customer" , cascade = CascadeType.ALL)
    private List<Orders> orders;
}
