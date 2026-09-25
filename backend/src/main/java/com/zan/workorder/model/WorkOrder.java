package com.zan.workorder.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name="workorder")
public class WorkOrder {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank 
    @Column(name="title", length=255, nullable=false)
    private String title;

    @Column(name="description", columnDefinition="TEXT") 
    private String description;

    @Column(name="clientName", length=200) 
    private String clientName;

    @Column(name="buildingName", length=100) 
    private String buildingName;

    @Column(name="floorName", length=100) 
    private String floorName;

    @Column(name="areaName", length=100) 
    private String areaName;

    @Column(name="deviceName", length=200) 
    private String deviceName;

    @Column(name="deviceType", length=100) 
    private String deviceType;

    @Column(name="deviceMacId", length=50) 
    private String deviceMacId;

    @NotNull 
    @Enumerated(EnumType.STRING)
    @Column(name="priority", length=20, nullable=false)
    private Priority priority = Priority.MEDIUM;

    @NotNull 
    @Enumerated(EnumType.STRING)
    @Column(name="status", length=20, nullable=false)
    private WorkOrderStatus status = WorkOrderStatus.OPEN;

    @Column(name="assignedTo", length=100) 
    private String assignedTo;

    @Column(name="createdBy", length=100) 
    private String createdBy;

    @Column(name="createdTime")
    private LocalDateTime createdTime;

    @Column(name="lastReportedTime")
    private LocalDateTime lastReportedTime;

    @Column(name="createdAt")
    private LocalDateTime createdAt;

    @Column(name="updatedAt")
    private LocalDateTime updatedAt;

    @Column(name="completedAt")
    private LocalDateTime completedAt;

    @PrePersist
    void onCreate() { 
        if (createdTime == null) {
            createdTime = LocalDateTime.now();
        }
        createdAt = createdTime; 
        updatedAt = createdAt; 
    }

    @PreUpdate
    void onUpdate() { 
        updatedAt = LocalDateTime.now(); 
    }

    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}

    public String getTitle(){return title;}
    public void setTitle(String v){title=v;}

    public String getDescription(){return description;}
    public void setDescription(String v){description=v;}

    public String getClientName(){return clientName;}
    public void setClientName(String v){clientName=v;}

    public String getBuildingName(){return buildingName;}
    public void setBuildingName(String v){buildingName=v;}

    public String getFloorName(){return floorName;}
    public void setFloorName(String v){floorName=v;}

    public String getAreaName(){return areaName;}
    public void setAreaName(String v){areaName=v;}

    public String getDeviceName(){return deviceName;}
    public void setDeviceName(String v){deviceName=v;}

    public String getDeviceType(){return deviceType;}
    public void setDeviceType(String v){deviceType=v;}

    public String getDeviceMacId(){return deviceMacId;}
    public void setDeviceMacId(String v){deviceMacId=v;}

    public Priority getPriority(){return priority;}
    public void setPriority(Priority v){priority=v;}

    public WorkOrderStatus getStatus(){return status;}
    public void setStatus(WorkOrderStatus v){status=v;}

    public String getAssignedTo(){return assignedTo;}
    public void setAssignedTo(String v){assignedTo=v;}

    public String getCreatedBy(){return createdBy;}
    public void setCreatedBy(String v){createdBy=v;}

    public LocalDateTime getCreatedTime(){return createdTime != null ? createdTime : createdAt;}
    public void setCreatedTime(LocalDateTime v){
        this.createdTime = v;
        if(this.createdAt == null) this.createdAt = v;
    }

    public LocalDateTime getLastReportedTime(){return lastReportedTime;}
    public void setLastReportedTime(LocalDateTime v){this.lastReportedTime = v;}

    public LocalDateTime getCreatedAt(){return createdAt != null ? createdAt : createdTime;}
    public void setCreatedAt(LocalDateTime v){
        this.createdAt = v;
        if(this.createdTime == null) this.createdTime = v;
    }

    public LocalDateTime getUpdatedAt(){return updatedAt;}
    public void setUpdatedAt(LocalDateTime v){this.updatedAt=v;}

    public LocalDateTime getCompletedAt(){return completedAt;}
    public void setCompletedAt(LocalDateTime v){completedAt=v;}
}
