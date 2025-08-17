package lk.ijse.gdse71.backend.controller;

import jakarta.validation.Valid;
import lk.ijse.gdse71.backend.dto.CustomerDTO;
import lk.ijse.gdse71.backend.dto.ItemDTO;
import lk.ijse.gdse71.backend.entiity.Item;
import lk.ijse.gdse71.backend.repository.ItemRepository;
import lk.ijse.gdse71.backend.service.ItemService;
import lk.ijse.gdse71.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/item")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class ItemController {
    private final ItemService itemService;

    @PostMapping("saveItem")
    public ResponseEntity<APIResponse> saveItem(@Valid @RequestBody ItemDTO itemDTO) {
        itemService.save(itemDTO);
        return ResponseEntity.ok(new APIResponse(201, "Item saved successfully", null));
    }

    @PutMapping("updateItem")
    public ResponseEntity<APIResponse> updateItem(@Valid @RequestBody ItemDTO itemDTO) {
        itemService.update(itemDTO);
        return ResponseEntity.ok(new APIResponse(200, "Item updated successfully", null));
    }

    @DeleteMapping("deleteItem/{id}")
    public ResponseEntity<APIResponse> deleteItem(@PathVariable Integer id) {
        itemService.delete(id);
        return ResponseEntity.ok(new APIResponse(200, "Item deleted successfully", null));
    }

    @GetMapping("getAllItems")
    public ResponseEntity<APIResponse> getAllItems() {
        List<ItemDTO> items = itemService.getAll();
        return ResponseEntity.ok(new APIResponse(200, "Items retrieved successfully", items));
    }


}