import { useState, useCallback, useEffect } from 'react';
import qz from 'qz-tray';

export const useQzPrinter = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      if (!qz.websocket.isActive()) {
        qz.security.setCertificatePromise((resolve: any) => resolve(""));
        qz.security.setSignatureAlgorithm("SHA512");
        qz.security.setSignaturePromise((_hash: string) => { return function (resolve: any) { resolve("") } });
        await qz.websocket.connect({ retries: 5, delay: 1 });
      }
      setIsConnected(true);
      setError(null);
    } catch (err: any) {
      console.error('QZ connection error:', err);
      setError('Không thể kết nối QZ Tray. Hãy chắc chắn phần mềm QZ Tray đang chạy.');
      setIsConnected(false);
      throw err;
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (qz.websocket.isActive()) {
      await qz.websocket.disconnect();
    }
    setIsConnected(false);
  }, []);

  const printRaw = useCallback(async (data: Uint8Array) => {
    try {
      if (!qz.websocket.isActive()) {
        await connect();
      }

      setError(null);
      const printers = await qz.printers.find("AIMO");
      const printerName = typeof printers === 'string' ? printers : printers[0];

      const config = qz.configs.create(printerName || "AIMO");
      const hexString = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
      const printData: any = [
        { type: 'raw', format: 'hex', data: hexString }
      ];

      await qz.print(config, printData);
      setError(null);
    } catch (err: any) {
      console.error('QZ print error:', err);
      setError('In lỗi (QZ Tray): ' + err.message);
    }
  }, [connect]);

  useEffect(() => {
    const init = async () => {
      if (!qz.websocket.isActive()) {
        try {
          await qz.websocket.connect({ retries: 2, delay: 1 });
          setIsConnected(true);
        } catch (e) {
          console.warn("Auto-connect to QZ Tray failed. Wait for manual connect.");
        }
      }
    };
    init();

    return () => {
      if (qz.websocket.isActive()) {
        qz.websocket.disconnect();
      }
    }
  }, []);

  return { connect, disconnect, print: printRaw, isConnected, error };
};
