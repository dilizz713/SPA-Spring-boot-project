package lk.ijse.gdse71.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ItemDTO {
    private Integer id;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotNull(message = "Price is required")
    private Double price;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String description;
}
