package lk.ijse.gdse71.backend.controller;

import lk.ijse.gdse71.backend.dto.OrderHistoryDTO;
import lk.ijse.gdse71.backend.dto.OrdersDTO;
import lk.ijse.gdse71.backend.service.OrdersService;
import lk.ijse.gdse71.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class OrdersController {
    private final OrdersService ordersService;

    @PostMapping("placeOrder")
    public ResponseEntity<APIResponse> saveOrder(@RequestBody OrdersDTO ordersDTO) {
        ordersService.placeOrder(ordersDTO);
        return ResponseEntity.ok(new APIResponse(201 , "Order saved successfully" , null));
    }

    @GetMapping("getAllOrdersHistory")
    public ResponseEntity<APIResponse> getAllOrders() {
        List<OrderHistoryDTO> orders = ordersService.getAllOrdersHistory();
        return ResponseEntity.ok(new APIResponse(200 , "Orders retrieved successfully" , orders));
    }

    @GetMapping("getTodayOrdersCount")
    public ResponseEntity<APIResponse> getTodayOrdersCount() {
        Long todayOrdersCount = ordersService.getTodayOrdersCount();
        return ResponseEntity.ok(new APIResponse(200 , "Orders count get successfully" , todayOrdersCount));
    }
}
