package lk.ijse.gdse71.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailsDTO {
    private Integer id;
    private Integer qtyOnHand;
    private Double price;

    private Integer orderId;
    private Integer itemId;
}
