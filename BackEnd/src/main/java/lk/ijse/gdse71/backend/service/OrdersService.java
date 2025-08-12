package lk.ijse.gdse71.backend.service;

import lk.ijse.gdse71.backend.dto.OrdersDTO;

public interface OrdersService {
    void placeOrder(OrdersDTO ordersDTO);
}
