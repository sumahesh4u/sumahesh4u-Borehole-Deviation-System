# # Usage
# initializeSerialCom(5) #5 is com5 here, change according to your port
# sendData(input("type to send data: "))
# print("data sent!!")
# receiveData()
# print("reached the end of the program")

import serial.tools.list_ports
import time

#global variable
serialInst = None

# Function to obtain available COM ports
def get_serial_ports():
    ports = serial.tools.list_ports.comports()
    port_info = [(port.device, port.description) for port in ports]
    return port_info

#run this only after the above function is used
def initializeSerialCom(portNumber):
    global serialInst
    serialInst = serial.Serial()
    serialInst.baudrate = 115200 #change according to what used in hardware
    serialInst.port = portNumber
    serialInst.open()

def checkConnection():
    if serialInst.is_open:
        return "Your PC is connected to: "+ str(serialInst.port),True
    else:
        return "No serial connection detected", None
def getConnectionStatus():
    if serialInst.is_open:
        return "Connected"
    else:
        return "Disconnected"

def sendData(data):
    global serialInst
    if serialInst is not None:
        time.sleep(2)  # have some gap
        serialInst.write(data.encode('utf-8'))
    else:
        print("Serial communication not initialized.")

def receiveData():
    global serialInst
    if serialInst is not None:
        while True:
            if serialInst.in_waiting > 0:
                received_data = serialInst.readline().decode('utf-8').strip()
                return received_data
    else:
        print("Serial communication not initialized.")

# reads the multiple lines of data
def ReceiveMultiLineData():
    global serialInst
    if serialInst is not None:
        data_lines = []  # Initialize a list to store received lines of data
        
        while serialInst.in_waiting > 0:
            received_data = serialInst.readline().decode('utf-8').strip()
            data_lines.append(received_data)  # Add received line to the list

        return data_lines
    else:
        print("Serial communication not initialized.")
 

def flushSerialBuffers():
    global serialInst
    if serialInst is not None:
        serialInst.reset_input_buffer()  # Flush input buffer
        serialInst.reset_output_buffer()  # Flush output buffer
        print("Serial buffers flushed successfully.")
    else:
        print("Serial communication not initialized.")
