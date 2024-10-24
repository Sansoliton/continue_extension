import pandas as pd
import time

def measurement(channelsLookup):
    # Step 1: Configure the Test Setup
    Vin = channelsLookup['Vin']
    Vout_DMM = channelsLookup['Vout']
    Vin_DMM = channelsLookup['Vin_DMM']
    
    # Set the load current
    I_load = channelsLookup['I_load']
    I_load.set_current_level(0.05)  # Set load current to 0.05mA

    # Step 2: Initial Measurement
    Vin.set_output_enabled(True)  # Enable the output
    Vin.set_voltage_level(5.0)  # Set initial voltage to 5V
    time.sleep(2)  # Stabilization time
    Vout1 = Vout_DMM.measure()  # Measure initial output voltage
    results = {
        'Input Voltage (V)': [],
        'Output Voltage (V)': [],
        'Line Regulation (%)': []
    }
    
    # Step 3: Repeated Measurements at Various Input Voltages
    for input_voltage in range(5, 21):  # Loop from 5V to 20V
        Vin.set_voltage_level(float(input_voltage))  # Set the input voltage
        time.sleep(2)  # Stabilization time
        Vout2 = Vout_DMM.measure()  # Measure output voltage
        
        # Step 4: Calculate Line Regulation
        if Vout1 != 0:  # Avoid division by zero
            line_regulation = ((Vout2 - Vout1) / Vout1) / ((input_voltage - 5) / 5) * 100
        else:
            line_regulation = None  # Do not calculate if Vout1 is zero
        
        # Store results
        results['Input Voltage (V)'].append(input_voltage)
        results['Output Voltage (V)'].append(Vout2)
        results['Line Regulation (%)'].append(line_regulation)
        
        # Update Vout1 for the next iteration
        Vout1 = Vout2

    # Step 6: Finalize Measurements
    # Create a DataFrame to log results
    results_df = pd.DataFrame(results)
    
    # Document results
    print(results_df)