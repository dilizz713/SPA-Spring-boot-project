package lk.ijse.gdse71.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class OrdersDTO {
    private Integer id;
    private Double totalAmount;
    private Date date;

    private Integer customerId;

}
