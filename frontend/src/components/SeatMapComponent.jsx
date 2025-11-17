import { useState, useEffect } from 'react';
import { Typography, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import useBookingStore from '../store/bookingStore';

const { Text } = Typography;

const SeatMapComponent = ({ seatLayout, bookedSeats = [], availableSeats = [] }) => {
  const { selectedSeats, addSeat, removeSeat, searchCriteria } = useBookingStore();
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    if (seatLayout && seatLayout.layout) {
      generateSeats();
    }
  }, [seatLayout, bookedSeats]);

  const generateSeats = () => {
    const { layout, rows, columns } = seatLayout;

    // Backend returns 2D array: [['A1', 'A2'], ['B1', 'B2'], ...]
    // Each layout[row][col] is a string like 'A1' or '' (empty)
    // We need to convert to seat objects

    const seatArray = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < columns; col++) {
        const seatNumber = layout[row]?.[col];

        // Create seat object
        let seat;
        if (!seatNumber || seatNumber === '') {
          // Empty space / aisle
          seat = { type: 'aisle', seatNumber: null };
        } else if (seatNumber === '🚗' || seatNumber.includes('Driver')) {
          // Driver seat
          seat = { type: 'driver', seatNumber: null };
        } else {
          // Regular seat
          seat = {
            type: 'seat',
            seatNumber: seatNumber,
            row: row,
            col: col
          };
        }

        rowSeats.push(seat);
      }
      seatArray.push(rowSeats);
    }

    setSeats(seatArray);
  };

  const handleSeatClick = (seat) => {
    console.log('Seat clicked:', seat);
    console.log('Current selectedSeats:', selectedSeats);

    if (!seat || seat.type === 'aisle' || seat.type === 'driver') {
      console.log('Seat click ignored: invalid seat type');
      return;
    }

    if (isSeatBooked(seat.seatNumber)) {
      console.log('Seat click ignored: seat is booked');
      return;
    }

    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);
    console.log('Is seat selected:', isSelected);

    if (isSelected) {
      console.log('Removing seat:', seat.seatNumber);
      removeSeat(seat.seatNumber);
    } else {
      // Check if max passengers reached
      if (selectedSeats.length >= searchCriteria.passengers) {
        console.log('Max passengers reached');
        return;
      }
      console.log('Adding seat:', seat);
      addSeat(seat);
    }
  };

  const isSeatSelected = (seatNumber) => {
    return selectedSeats.some(s => s.seatNumber === seatNumber);
  };

  const isSeatBooked = (seatNumber) => {
    return bookedSeats.includes(seatNumber);
  };

  const getSeatClass = (seat) => {
    if (!seat || seat.type === 'aisle') return 'invisible';
    if (seat.type === 'driver') return 'seat-driver';

    const isSelected = isSeatSelected(seat.seatNumber);
    const isBooked = isSeatBooked(seat.seatNumber);

    if (isBooked) return 'seat-booked';
    if (isSelected) return 'seat-selected';
    return 'seat-available';
  };

  const getSeatIcon = (seat) => {
    if (!seat || seat.type === 'aisle') return null;
    if (seat.type === 'driver') return '🚗';

    const isSelected = isSeatSelected(seat.seatNumber);
    const isBooked = isSeatBooked(seat.seatNumber);

    if (isBooked) return <CloseCircleOutlined />;
    if (isSelected) return <CheckCircleFilled />;
    return seat.seatNumber;
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
            ✓
          </div>
          <Text className="text-xs">Đang chọn</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
            1
          </div>
          <Text className="text-xs">Còn trống</Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-400 rounded flex items-center justify-center text-white">
            ✕
          </div>
          <Text className="text-xs">Đã đặt</Text>
        </div>
      </div>

      {/* Seat Map */}
      <div className="bg-gray-100 p-4 rounded-lg">
        {/* Driver indicator */}
        <div className="text-center mb-2 text-xs text-gray-600">
          ↑ Đầu xe
        </div>

        <div className="seat-map-container">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2 mb-2">
              {row.map((seat, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`seat ${getSeatClass(seat)}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={
                    !seat ||
                    seat.type === 'aisle' ||
                    seat.type === 'driver' ||
                    isSeatBooked(seat?.seatNumber)
                  }
                  title={
                    seat && seat.type !== 'aisle' && seat.type !== 'driver'
                      ? `Ghế ${seat.seatNumber}${seat.floor === 2 ? ' (Tầng 2)' : ''}`
                      : ''
                  }
                >
                  {getSeatIcon(seat)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Seat Map Styles */}
      <style jsx>{`
        .seat {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          border: 2px solid transparent;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-center;
        }

        .seat:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .seat-available {
          background-color: #e5e7eb;
          border-color: #9ca3af;
          color: #374151;
        }

        .seat-available:hover {
          background-color: #d1d5db;
          border-color: #6b7280;
        }

        .seat-selected {
          background-color: #10b981;
          border-color: #059669;
          color: white;
        }

        .seat-booked {
          background-color: #f87171;
          border-color: #ef4444;
          color: white;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .seat-driver {
          background-color: #3b82f6;
          border-color: #2563eb;
          color: white;
          cursor: not-allowed;
          font-size: 18px;
        }

        .seat:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SeatMapComponent;
