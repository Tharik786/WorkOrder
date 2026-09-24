package com.zan.workorder.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name="work_orders")
public class WorkOrder {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank private String title;
    @Column(length=2000) private String description;
    private String clientName;
    private String buildingName;
    private String deviceMacId;

    @NotNull @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @NotNull @Enumerated(EnumType.STRING)
    private WorkOrderStatus status = WorkOrderStatus.OPEN;

    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }

    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId(){return id;}
    public String getTitle(){return title;}
    public void setTitle(String v){title=v;}
    public String getDescription(){return description;}
    public void setDescription(String v){description=v;}
    public String getClientName(){return clientName;}
    public void setClientName(String v){clientName=v;}
    public String getBuildingName(){return buildingName;}
    public void setBuildingName(String v){buildingName=v;}
    public String getDeviceMacId(){return deviceMacId;}
    public void setDeviceMacId(String v){deviceMacId=v;}
    public Priority getPriority(){return priority;}
    public void setPriority(Priority v){priority=v;}
    public WorkOrderStatus getStatus(){return status;}
    public void setStatus(WorkOrderStatus v){status=v;}
    public String getAssignedTo(){return assignedTo;}
    public void setAssignedTo(String v){assignedTo=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getUpdatedAt(){return updatedAt;}
    public LocalDateTime getCompletedAt(){return completedAt;}
    public void setCompletedAt(LocalDateTime v){completedAt=v;}
}
