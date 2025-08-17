package lk.ijse.gdse71.backend.exception;

import lk.ijse.gdse71.backend.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handleGenericException(Exception e) {
        return new ResponseEntity<>(new APIResponse(500, e.getMessage() ,null ), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> resourceNotFound(ResourceNotFoundException e) {
        return new ResponseEntity<>(new APIResponse(404, e.getMessage() ,null ), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<APIResponse> resourceAlreadyExists(ResourceAlreadyExists e) {
        return new ResponseEntity<>(new APIResponse(409, e.getMessage() ,null ), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NotEnoughQuantityException.class)
    public ResponseEntity<APIResponse> notEnoughQty(NotEnoughQuantityException e){
        return new ResponseEntity<>(new APIResponse(409, e.getMessage() ,null ), HttpStatus.CONFLICT);
    }
}
