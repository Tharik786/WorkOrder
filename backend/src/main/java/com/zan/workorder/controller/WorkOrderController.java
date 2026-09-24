package com.zan.workorder.controller;

import com.zan.workorder.model.*;
import com.zan.workorder.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@CrossOrigin(origins="*")
public class WorkOrderController {
    private final WorkOrderService service;
    public WorkOrderController(WorkOrderService service){this.service=service;}

    @GetMapping public List<WorkOrder> all(){return service.all();}
    @GetMapping("/{id}") public WorkOrder get(@PathVariable Long id){return service.get(id);}
    @GetMapping("/status/{status}") public List<WorkOrder> status(@PathVariable WorkOrderStatus status){return service.byStatus(status);}
    @GetMapping("/priority/{priority}") public List<WorkOrder> priority(@PathVariable Priority priority){return service.byPriority(priority);}
    @PostMapping public ResponseEntity<WorkOrder> create(@Valid @RequestBody WorkOrder w){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(w));}
    @PutMapping("/{id}") public WorkOrder update(@PathVariable Long id,@Valid @RequestBody WorkOrder w){return service.update(id,w);}
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
}
