package lk.ijse.gdse71.backend.service;

import lk.ijse.gdse71.backend.dto.OrderHistoryDTO;
import lk.ijse.gdse71.backend.dto.OrdersDTO;

import java.util.List;

public interface OrdersService {
    void placeOrder(OrdersDTO ordersDTO);


    List<OrderHistoryDTO> getAllOrdersHistory();
}
