using System.Runtime.InteropServices;
using ENet;

namespace FleeingLegacy.ENetServer;

public class ServerMain {
    public static void Main(String[] args) {
        if(Library.Initialize()) {
            WriteLineFlushed($"[ENet] Library successfully initialized, compat: {Library.version}");
        }

        using Host host = new();
        Address address = new();
        address.SetIP("127.0.0.1");
        address.Port = 22102;

        try {
            host.Create(address, 10);
            if(host.IsSet) {
                WriteLineFlushed($"[ENet] Server is up!  {address.GetIP()}:{address.Port}");
            } else {
                WriteLineFlushed("[ENet] Can't create server, exiting now!");
                return;
            }
        } catch {
            WriteLineFlushed("[ENet] Can't create server, exiting now!");
        }

        host.SetInterceptCallback(PacketInterceptCallback);
        host.SetChecksumCallback(PacketChecksumCallback);

        Event enetEvent;

        while(true) {
            bool polled = false;

            while(!polled) {
                if(host.CheckEvents(out enetEvent) <= 0) {
                    if(host.Service(50, out enetEvent) <= 0) {
                        break;
                    }

                    polled = true;
                }

                switch(enetEvent.Type) {
                    case EventType.None:
                        break;
                    case EventType.Connect:
                        WriteLineFlushed("Connect!");
                        break;
                    case EventType.Disconnect:
                        WriteLineFlushed("Disconnect!");
                        break;
                    case EventType.Timeout:
                        WriteLineFlushed("Timeout!");
                        break;
                    case EventType.Receive:
                        WriteLineFlushed("Receive!");
                        enetEvent.Packet.Dispose();
                        break;
                }
            }
        }

        host.Flush();
    }

    private static void WriteLineFlushed(object obj) {
        Console.Out.WriteLine(obj);
        Console.Out.Flush();
    }

    private static int PacketInterceptCallback(ref Event @event, ref Address address, IntPtr receivedData, int receivedDataLength) {
        byte[] data = new byte[receivedDataLength];
        Marshal.Copy(receivedData, data, 0, receivedDataLength);

        WriteLineFlushed("[ENet] Intercept: " + Convert.ToHexString(data));
        return 0;
    }

    private static ulong PacketChecksumCallback(IntPtr receivedData, int receivedDataLength) {
        byte[] data = new byte[receivedDataLength];
        Marshal.Copy(receivedData, data, 0, receivedDataLength);

        WriteLineFlushed("[ENet] Checksum: " + Convert.ToHexString(data));
        return 0;
    }
}