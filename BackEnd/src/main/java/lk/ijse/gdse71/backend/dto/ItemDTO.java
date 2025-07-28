package lk.ijse.gdse71.backend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ItemDTO {
    private Integer id;
    private String itemName;
    private Double price;
    private Integer quantity;
    private String description;
}
