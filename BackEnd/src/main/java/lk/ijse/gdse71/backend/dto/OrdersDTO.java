package lk.ijse.gdse71.backend.dto;

import lk.ijse.gdse71.backend.entiity.OrderDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class OrdersDTO {
    private Integer id;
    private Double totalAmount;
    private Integer customerId;

    private List<OrderDetailsDTO> orderDetails;

}
