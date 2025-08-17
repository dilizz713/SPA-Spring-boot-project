package lk.ijse.gdse71.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderHistoryDTO {
    private Integer id;
    private String orderDate;
    private Integer customerId;
    private String customerName;
    private Double totalAmount;
}
