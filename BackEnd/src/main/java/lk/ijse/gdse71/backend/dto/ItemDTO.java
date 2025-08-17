package lk.ijse.gdse71.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ItemDTO {
    private Integer id;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotBlank(message = "Price is required")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Price must be a valid number (max 2 decimal places)")
    private Double price;

    @NotBlank(message = "Quantity is required")
    @Pattern(regexp = "^[0-9]+$", message = "Quantity must be a positive integer")
    private Integer quantity;

    private String description;
}
