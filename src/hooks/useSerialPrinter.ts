import { useState, useCallback, useEffect } from 'react';

export const useSerialPrinter = () => {
  const [port, setPort] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Web Serial is supported
  const isSupported = 'serial' in navigator;

  const [deviceInfo, setDeviceInfo] = useState<{ vid?: number, pid?: number } | null>(null);

  const connect = useCallback(async () => {
    if (!isSupported) {
      setError('Trình duyệt không hỗ trợ Web Serial API.');
      return;
    }

    try {
      const selectedPort = await (navigator as any).serial.requestPort();
      const info = selectedPort.getInfo();

      await selectedPort.open({ baudRate: 9600 });

      setPort(selectedPort);
      setDeviceInfo({ vid: info.usbVendorId, pid: info.usbProductId });
      setIsConnected(true);
      setError(null);
    } catch (err: any) {
      console.error('Serial connection error:', err);
      setError('Không thể kết nối: ' + err.message);
      setIsConnected(false);
    }
  }, [isSupported]);

  const disconnect = useCallback(async () => {
    if (port) {
      try {
        await port.close();
      } catch (err) {
        console.error('Error closing port:', err);
      }
      setPort(null);
      setDeviceInfo(null);
      setIsConnected(false);
    }
  }, [port]);

  const print = useCallback(async (data: Uint8Array) => {
    if (!port || !port.writable) {
      setError('Máy in chưa được kết nối hoặc không sẵn sàng.');
      return;
    }

    const writer = port.writable.getWriter();
    try {
      await writer.write(data);
      setError(null);
    } catch (err: any) {
      console.error('Print error:', err);
      setError('Lỗi khi gửi dữ liệu in: ' + err.message);
    } finally {
      writer.releaseLock();
    }
  }, [port]);

  // Listen for disconnect events
  useEffect(() => {
    if (!isSupported) return;

    const handleDisconnect = () => {
      setIsConnected(false);
      setPort(null);
    };

    (navigator as any).serial.addEventListener('disconnect', handleDisconnect);
    return () => {
      (navigator as any).serial.removeEventListener('disconnect', handleDisconnect);
    };
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return;

    const autoConnect = async () => {
      try {
        const ports = await (navigator as any).serial.getPorts();
        if (ports.length > 0) {
          const authorizedPort = ports[0];
          // Check if port is already open or closed
          if (authorizedPort.writable === null) {
            await authorizedPort.open({ baudRate: 9600 });
          }
          setPort(authorizedPort);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Auto-connect error:', err);
      }
    };

    autoConnect();
  }, [isSupported]);

  return { connect, disconnect, print, isConnected, isSupported, error, deviceInfo };
};
