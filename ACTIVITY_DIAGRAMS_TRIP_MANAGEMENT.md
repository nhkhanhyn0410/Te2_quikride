# ACTIVITY DIAGRAMS - QUẢN LÝ CHUYẾN XE

## 1. Activity Diagram - Quy trình tạo chuyến của nhà xe

```mermaid
graph TD
    A[Bắt đầu] --> B[Operator đăng nhập hệ thống]
    B --> C[Chọn chức năng 'Tạo chuyến xe']
    C --> D[Nhập thông tin chuyến xe]
    
    D --> E{Kiểm tra thông tin bắt buộc}
    E -->|Thiếu thông tin| F[Hiển thị lỗi validation]
    F --> D
    
    E -->|Đầy đủ| G[Validate tuyến đường]
    G --> H{Tuyến đường hợp lệ?}
    H -->|Không| I[Thông báo lỗi tuyến đường]
    I --> D
    
    H -->|Có| J[Validate xe buýt]
    J --> K{Xe buýt khả dụng?}
    K -->|Không| L[Thông báo xe không khả dụng]
    L --> D
    
    K -->|Có| M[Validate tài xế]
    M --> N{Tài xế khả dụng?}
    N -->|Không| O[Thông báo tài xế không khả dụng]
    O --> D
    
    N -->|Có| P[Validate quản lý chuyến]
    P --> Q{Quản lý chuyến khả dụng?}
    Q -->|Không| R[Thông báo quản lý chuyến không khả dụng]
    R --> D
    
    Q -->|Có| S[Kiểm tra trùng lịch]
    S --> T{Có trùng lịch?}
    T -->|Có| U[Thông báo trùng lịch]
    U --> D
    
    T -->|Không| V[Tính toán thông tin ghế]
    V --> W[Tính toán giá cuối]
    W --> X[Tạo chuyến trong database]
    
    X --> Y{Tạo thành công?}
    Y -->|Không| Z[Thông báo lỗi hệ thống]
    Z --> D
    
    Y -->|Có| AA[Gửi thông báo cho tài xế]
    AA --> BB[Gửi thông báo cho quản lý chuyến]
    BB --> CC[Cập nhật lịch làm việc]
    CC --> DD[Hiển thị thông báo thành công]
    DD --> EE[Kết thúc]

    %% Styling
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#fff3e0
    classDef error fill:#ffebee
    
    class A,EE startEnd
    class B,C,D,G,J,M,P,S,V,W,X,AA,BB,CC,DD process
    class E,H,K,N,Q,T,Y decision
    class F,I,L,O,R,U,Z error
```

### Mô tả chi tiết quy trình:

**1. Khởi tạo:**
- Operator đăng nhập và truy cập chức năng tạo chuyến xe
- Hệ thống hiển thị form nhập thông tin

**2. Nhập và validate thông tin:**
- Thông tin bắt buộc: Tuyến đường, Xe buýt, Tài xế, Quản lý chuyến, Thời gian khởi hành/đến
- Validate từng thành phần một cách tuần tự

**3. Kiểm tra tài nguyên:**
- Tuyến đường phải thuộc về operator và đang hoạt động
- Xe buýt phải khả dụng và có sơ đồ ghế
- Tài xế phải có giấy phép còn hạn và đang hoạt động
- Quản lý chuyến phải đang hoạt động

**4. Kiểm tra trùng lịch:**
- Kiểm tra xe buýt không bị trùng lịch
- Kiểm tra tài xế không bị trùng ca
- Kiểm tra quản lý chuyến không bị trùng ca

**5. Tạo chuyến:**
- Tính toán số ghế từ sơ đồ xe buýt
- Tính giá cuối từ giá gốc và discount
- Lưu vào database với trạng thái 'scheduled'

**6. Thông báo:**
- Gửi notification cho tài xế và quản lý chuyến
- Cập nhật lịch làm việc của nhân viên

---

## 2. Activity Diagram - Quy trình làm việc của Trip Manager

```mermaid
graph TD
    A[Bắt đầu ca làm việc] --> B[Trip Manager đăng nhập]
    B --> C[Xem danh sách chuyến được phân công]
    
    C --> D[Chọn chuyến cần quản lý]
    D --> E[Kiểm tra thông tin chuyến]
    
    E --> F{Trạng thái chuyến?}
    F -->|Scheduled| G[Chuẩn bị trước chuyến]
    F -->|Ongoing| H[Quản lý trong chuyến]
    F -->|Completed| I[Xử lý sau chuyến]
    
    %% Chuẩn bị trước chuyến
    G --> G1[Kiểm tra xe buýt]
    G1 --> G2[Kiểm tra tài xế]
    G2 --> G3[Kiểm tra danh sách hành khách]
    G3 --> G4[Cập nhật trạng thái 'ready']
    G4 --> G5{Đến giờ khởi hành?}
    G5 -->|Chưa| G6[Chờ đến giờ]
    G6 --> G5
    G5 -->|Đã đến| G7[Bắt đầu chuyến]
    G7 --> G8[Cập nhật trạng thái 'ongoing']
    G8 --> H
    
    %% Quản lý trong chuyến
    H --> H1[Theo dõi hành trình]
    H1 --> H2[Xử lý vấn đề phát sinh]
    H2 --> H3[Cập nhật vị trí xe]
    H3 --> H4[Giao tiếp với khách hàng]
    H4 --> H5{Có sự cố?}
    H5 -->|Có| H6[Xử lý sự cố]
    H6 --> H7[Báo cáo sự cố]
    H7 --> H8[Cập nhật thông tin chuyến]
    H8 --> H1
    H5 -->|Không| H9{Đến điểm đến?}
    H9 -->|Chưa| H1
    H9 -->|Đã đến| H10[Kết thúc chuyến]
    H10 --> H11[Cập nhật trạng thái 'completed']
    H11 --> I
    
    %% Xử lý sau chuyến
    I --> I1[Kiểm tra số lượng hành khách]
    I1 --> I2[Thu thập feedback]
    I2 --> I3[Báo cáo tình trạng xe]
    I3 --> I4[Cập nhật báo cáo chuyến]
    I4 --> I5[Xác nhận hoàn thành]
    
    I5 --> J{Còn chuyến khác?}
    J -->|Có| C
    J -->|Không| K[Kết thúc ca làm việc]
    
    %% Xử lý sự cố đặc biệt
    H6 --> SC1{Loại sự cố?}
    SC1 -->|Xe hỏng| SC2[Liên hệ cứu hộ]
    SC1 -->|Khách hàng| SC3[Xử lý khiếu nại]
    SC1 -->|Thời tiết| SC4[Điều chỉnh lộ trình]
    SC1 -->|Khác| SC5[Báo cáo operator]
    
    SC2 --> SC6[Chờ xe thay thế]
    SC3 --> SC7[Ghi nhận khiếu nại]
    SC4 --> SC8[Thông báo khách hàng]
    SC5 --> SC9[Chờ hướng dẫn]
    
    SC6 --> H8
    SC7 --> H8
    SC8 --> H8
    SC9 --> H8
    
    K --> L[Kết thúc]

    %% Styling
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#fff3e0
    classDef incident fill:#ffecb3
    
    class A,L startEnd
    class B,C,D,E,G1,G2,G3,G4,G6,G7,G8,H1,H2,H3,H4,H6,H7,H8,H10,H11,I1,I2,I3,I4,I5,K process
    class F,G5,H5,H9,J,SC1 decision
    class G,H,I incident
    class SC2,SC3,SC4,SC5,SC6,SC7,SC8,SC9 incident
```

### Mô tả chi tiết quy trình Trip Manager:

**1. Bắt đầu ca làm việc:**
- Trip Manager đăng nhập hệ thống
- Xem danh sách các chuyến được phân công trong ngày
- Chọn chuyến cần quản lý

**2. Chuẩ bị trước chuyến (Scheduled):**
- Kiểm tra tình trạng xe buýt (nhiên liệu, vệ sinh, an toàn)
- Xác nhận tài xế có mặt và sẵn sàng
- Kiểm tra danh sách hành khách và vé
- Cập nhật trạng thái chuyến thành 'ready'
- Chờ đến giờ khởi hành và bắt đầu chuyến

**3. Quản lý trong chuyến (Ongoing):**
- Theo dõi hành trình và vị trí xe
- Xử lý các vấn đề phát sinh
- Cập nhật vị trí xe theo thời gian thực
- Giao tiếp với khách hàng khi cần thiết
- Xử lý sự cố nếu có

**4. Xử lý sự cố:**
- **Xe hỏng:** Liên hệ cứu hộ, chờ xe thay thế
- **Khách hàng:** Xử lý khiếu nại, ghi nhận feedback
- **Thời tiết:** Điều chỉnh lộ trình, thông báo khách hàng
- **Khác:** Báo cáo operator và chờ hướng dẫn

**5. Kết thúc chuyến (Completed):**
- Kiểm tra số lượng hành khách xuống xe
- Thu thập feedback từ khách hàng
- Báo cáo tình trạng xe sau chuyến
- Cập nhật báo cáo chuyến đi
- Xác nhận hoàn thành chuyến

**6. Lặp lại:**
- Nếu còn chuyến khác trong ca, quay lại bước 3
- Nếu hết chuyến, kết thúc ca làm việc

---

## 3. Sơ đồ tương tác giữa các Actor

```mermaid
sequenceDiagram
    participant O as Operator
    participant TM as Trip Manager
    participant D as Driver
    participant S as System
    participant C as Customer

    Note over O,C: Quy trình tạo và quản lý chuyến xe

    %% Tạo chuyến
    O->>S: Tạo chuyến xe mới
    S->>S: Validate thông tin
    S->>TM: Thông báo phân công
    S->>D: Thông báo phân công
    S->>O: Xác nhận tạo thành công

    %% Chuẩn bị chuyến
    TM->>S: Kiểm tra thông tin chuyến
    TM->>D: Xác nhận tài xế sẵn sàng
    D->>TM: Xác nhận ready
    TM->>S: Cập nhật trạng thái 'ready'

    %% Bắt đầu chuyến
    TM->>S: Bắt đầu chuyến
    S->>C: Thông báo chuyến đã khởi hành
    S->>O: Cập nhật trạng thái chuyến

    %% Trong chuyến
    loop Theo dõi hành trình
        TM->>S: Cập nhật vị trí
        S->>C: Thông báo vị trí xe
        
        alt Có sự cố
            TM->>S: Báo cáo sự cố
            S->>O: Thông báo sự cố
            S->>C: Thông báo delay/thay đổi
        end
    end

    %% Kết thúc chuyến
    TM->>S: Kết thúc chuyến
    S->>C: Thông báo đã đến đích
    TM->>S: Báo cáo chuyến
    S->>O: Báo cáo tổng kết
```

Các Activity Diagrams này mô tả chi tiết quy trình tạo chuyến của nhà xe và quy trình làm việc của Trip Manager, bao gồm tất cả các bước validation, xử lý sự cố và tương tác giữa các thành phần trong hệ thống.