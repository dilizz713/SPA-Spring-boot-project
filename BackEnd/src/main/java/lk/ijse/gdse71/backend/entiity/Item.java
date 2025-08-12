package lk.ijse.gdse71.backend.entiity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String itemName;
    private Double price;
    private Integer quantity;
    private String description;

    @OneToMany(mappedBy = "item" , cascade = CascadeType.ALL)
    private List<OrderDetails> orderDetails;
}
